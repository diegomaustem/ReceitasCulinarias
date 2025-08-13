<template>
  <div v-if="modelValue" class="modal fade show d-block">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ receitaParaEdicao ? "Editar Receita" : "Nova Receita" }}
          </h5>
          <button @click="fecharModal" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="salvar">
            <div class="mb-3">
              <label class="form-label">Título</label>
              <input
                v-model="form.nome"
                class="form-control"
                @blur="v$.form.nome.$touch()"
              />
              <div
                v-if="v$.form.nome.$error"
                class="text-danger text-start pt-1"
              >
                * {{ v$.form.nome.$errors[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Categoria</label>
              <select
                v-model.number="form.idCategorias"
                class="form-select"
                :disabled="categoriaStore.loading"
              >
                <option :value="null">Sem categoria</option>
                <option
                  v-for="categoria in categoriaStore.categorias"
                  :key="categoria.id"
                  :value="categoria.id"
                >
                  {{ categoria.nome }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Ingredientes</label>
              <textarea
                v-model="form.ingredientes"
                class="form-control"
                rows="3"
                @blur="v$.form.ingredientes.$touch()"
              ></textarea>
              <div
                v-if="v$.form.ingredientes.$error"
                class="text-danger text-start pt-1"
              >
                * {{ v$.form.ingredientes.$errors[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Modo de Preparo</label>
              <textarea
                v-model="form.modoPreparo"
                class="form-control"
                rows="5"
                @blur="v$.form.modoPreparo.$touch()"
              ></textarea>
              <div
                v-if="v$.form.modoPreparo.$error"
                class="text-danger text-start pt-1"
              >
                * {{ v$.form.modoPreparo.$errors[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Tempo de Preparo (minutos)</label>
              <input
                v-model.number="form.tempoPreparoMinutos"
                type="number"
                class="form-control"
                @blur="v$.form.tempoPreparoMinutos.$touch()"
              />
              <div
                v-if="v$.form.tempoPreparoMinutos.$error"
                class="text-danger text-start pt-1"
              >
                * {{ v$.form.tempoPreparoMinutos[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Porção (Unidade)</label>
              <input
                v-model.number="form.porcoes"
                type="number"
                class="form-control"
                @blur="v$.form.porcoes.$touch()"
              />
              <div
                v-if="v$.form.porcoes.$error"
                class="text-danger text-start pt-1"
              >
                * {{ v$.form.porcoes.$errors[0]?.$message }}
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="fecharModal"
                :disabled="loading"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-default"
                :disabled="v$.$invalid || loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-1"
                ></span>
                {{ receitaParaEdicao ? "Salvar" : "Criar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  numeric,
  helpers,
} from "@vuelidate/validators";
import { useReceitaStore } from "../stores/receita.store";
import type { Receita } from "../types/Receita";
import { useCategoriaStore } from "../stores/categoria.store";
import { useAuthStore } from "../stores/auth.store";

const usuarioAuth = useAuthStore();
const categoriaStore = useCategoriaStore();
const props = defineProps<{
  modelValue: boolean;
  receitaParaEdicao?: Receita | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const receitaStore = useReceitaStore();
const loading = ref(false);

const form = reactive({
  nome: "",
  ingredientes: "",
  modoPreparo: "",
  porcoes: null as number | null,
  tempoPreparoMinutos: null as number | null,
  idCategorias: null as number | null,
});

const rules = {
  form: {
    nome: {
      isAlphanumeric: helpers.withMessage(
        "Receita não pode ser apenas número(s).",
        helpers.regex(/^(?=.*[a-zA-Z])[a-zA-ZÀ-ÿ\s0-9@.#*:/]+$/)
      ),
      minLength: helpers.withMessage("Mínimo 3 caracteres.", minLength(3)),
      maxLength: helpers.withMessage("Máximo 45 caracteres.", maxLength(45)),
    },
    ingredientes: {
      required: helpers.withMessage("Ingredientes é obrigatório.", required),
      minLength: helpers.withMessage("Mínimo 10 caracteres.", minLength(10)),
    },
    modoPreparo: {
      required: helpers.withMessage("Modo de preparo é obrigatório.", required),
      minLength: helpers.withMessage("Mínimo 20 caracteres.", minLength(20)),
    },
    tempoPreparoMinutos: {
      required: helpers.withMessage(
        "Tempo de preparo é obrigatório.",
        required
      ),
      numeric: helpers.withMessage(
        "Tempo de preparodeve ser um número.",
        numeric
      ),
    },
    porcoes: {
      numeric: helpers.withMessage("Porção deve ser um número", numeric),
    },
  },
};

const v$ = useVuelidate(rules, { form });

watch(
  () => props.receitaParaEdicao,
  (receita) => {
    if (receita) {
      form.nome = receita.nome;
      form.ingredientes = receita.ingredientes;
      form.modoPreparo = receita.modoPreparo;
      form.tempoPreparoMinutos = receita.tempoPreparoMinutos;
      form.porcoes = receita.porcoes || null;
      form.idCategorias = receita.idCategorias || null;
    } else {
      resetarFormulario();
    }
  }
);

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && categoriaStore.categorias.length === 0) {
      await categoriaStore.carregarCategorias();
    }
  }
);

const resetarFormulario = () => {
  form.nome = "";
  form.ingredientes = "";
  form.modoPreparo = "";
  form.tempoPreparoMinutos = null;
  form.porcoes = null;
  form.idCategorias = null;
  v$.value.$reset();
};

const fecharModal = () => {
  if (!props.receitaParaEdicao) {
    resetarFormulario();
  }
  emit("update:modelValue", false);
};

const salvar = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;

  try {
    const dadosReceita = {
      ...form,
      tempoPreparoMinutos: form.tempoPreparoMinutos || 0,
      porcoes: form.porcoes || 1,
      ...(!props.receitaParaEdicao && {
        idUsuarios: usuarioAuth.usuarioLogado?.id,
      }),
    };

    console.log("Dados que serão enviados para a API:", dadosReceita);

    if (props.receitaParaEdicao?.id) {
      await receitaStore.atualizarReceita(
        props.receitaParaEdicao.id,
        dadosReceita
      );
    } else {
      await receitaStore.adicionarReceita(dadosReceita);
    }

    fecharModal();
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.btn-default {
  background-color: #f59c00;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-default:hover {
  filter: brightness(0.9);
}
</style>
