<template>
  <div v-if="modelValue" class="modal fade show d-block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ usuarioParaEdicao ? "Editar Usuário" : "Novo Usuário" }}
          </h5>
          <button @click="fecharModal" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="salvar">
            <div class="mb-3">
              <label class="form-label">Nome</label>
              <input
                v-model="form.nome"
                class="form-control"
                @blur="v$.form.nome.$touch()"
              />
              <div
                v-if="v$.form.nome.$error"
                class="text-danger-default text-start pt-1"
              >
                * {{ v$.form.nome.$errors[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Login</label>
              <input
                v-model="form.login"
                class="form-control"
                @blur="v$.form.login.$touch()"
              />
              <div
                v-if="v$.form.login.$error"
                class="text-danger-default text-start pt-1"
              >
                * {{ v$.form.login.$errors[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Senha</label>
              <input
                v-model="form.senha"
                type="password"
                class="form-control"
                @blur="v$.form.senha.$touch()"
              />
              <div
                v-if="v$.form.senha.$error"
                class="text-danger-default text-start pt-1"
              >
                * {{ v$.form.senha.$errors[0]?.$message }}
              </div>
              <small v-if="usuarioParaEdicao" class="text-muted">
                Deixe em branco para manter a senha atual
              </small>
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
                {{ usuarioParaEdicao ? "Salvar" : "Criar" }}
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
  helpers,
  isAlphanumeric,
} from "@vuelidate/validators";
import type { Usuario } from "../types/Usuario";
import { useUsuarioStore } from "../stores/usuario.store";

const props = defineProps<{
  modelValue: boolean;
  usuarioParaEdicao?: Usuario | null;
}>();

const emit = defineEmits(["update:modelValue"]);
const usuarioStore = useUsuarioStore();
const loading = ref(false);

const form = reactive({
  nome: "",
  login: "",
  senha: "",
});

const rules = {
  form: {
    nome: {
      isAlphanumeric: helpers.withMessage(
        "O nome não pode ser número.",
        helpers.regex(/^(?=.*[a-zA-Z])[a-zA-ZÀ-ÿ\s0-9@]+$/)
      ),
      minLength: helpers.withMessage(
        "Mínimo 3 caracteres para o nome.",
        minLength(3)
      ),
      maxLength: helpers.withMessage(
        "Máximo 100 caracteres para o nome.",
        maxLength(100)
      ),
    },
    login: {
      required: helpers.withMessage("Login é obrigatório", required),
      isAlphanumeric: helpers.withMessage(
        "O login não pode ser número.",
        helpers.regex(/^(?=.*[a-zA-Z])[a-zA-ZÀ-ÿ\s0-9@.#*:/]+$/)
      ),
      minLength: helpers.withMessage("Mínimo 3 caracteres", minLength(3)),
      maxLength: helpers.withMessage("Máximo 50 caracteres", maxLength(50)),
    },
    senha: {
      minLength: helpers.withMessage("Mínimo 6 caracteres", minLength(6)),
      maxLength: helpers.withMessage("Máximo 20 caracteres", maxLength(20)),
      required: helpers.withMessage("Senha é obrigatória", (value) =>
        !props.usuarioParaEdicao ? !!value && value.length >= 6 : true
      ),
    },
  },
};

const v$ = useVuelidate(rules, { form });

watch(
  () => props.usuarioParaEdicao,
  (usuario) => {
    if (usuario) {
      form.nome = usuario.nome;
      form.login = usuario.login;
      form.senha = "";
    } else {
      resetarFormulario();
    }
  }
);

const resetarFormulario = () => {
  form.nome = "";
  form.login = "";
  form.senha = "";
  v$.value.$reset();
};

const fecharModal = () => {
  if (!props.usuarioParaEdicao) {
    resetarFormulario();
  }
  emit("update:modelValue", false);
};

const salvar = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;

  try {
    const dadosUsuario = {
      nome: form.nome.trim() || null,
      login: form.login,
      ...(props.usuarioParaEdicao
        ? form.senha && { senha: form.senha }
        : { senha: form.senha }),
    };

    if (props.usuarioParaEdicao?.id) {
      await usuarioStore.atualizarUsuario(
        props.usuarioParaEdicao.id,
        dadosUsuario
      );
    } else {
      await usuarioStore.adicionarUsuario(dadosUsuario);
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

.modal-title {
  font-weight: 600;
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
