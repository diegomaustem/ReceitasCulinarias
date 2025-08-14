<template>
  <div class="container py-4">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start mb-4 gap-3"
    >
      <h1 class="h3 mb-0 order-1 order-md-0">Receitas</h1>

      <div
        class="input-group order-2 order-md-1 flex-grow-1 flex-md-grow-0"
        style="min-width: 250px; max-width: 500px"
      >
        <input
          v-model="termoBusca"
          type="text"
          class="form-control"
          placeholder="Buscar receitas..."
        />
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
      </div>

      <button
        class="btn btn-default order-0 order-md-2"
        @click="abrirFormulario"
        :disabled="receitaStore.loading"
      >
        <i class="bi bi-plus-circle"></i>
        <span class="d-none d-md-inline">Nova Receita</span>
        <span class="d-inline d-md-none">Nova</span>
      </button>
    </div>

    <div
      v-if="receitaStore.loading && receitaStore.receitas.length === 0"
      class="text-center py-5"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div
        class="col"
        v-for="receita in receitaStore.receitas"
        :key="receita.id"
      >
        <ReceitaCard
          :receita="receita"
          @visualizar="visualizarReceita(receita.id)"
          @editar="editarReceita(receita)"
          @excluir="excluirReceita(receita.id)"
        />
      </div>
    </div>

    <div
      v-if="!receitaStore.loading && receitaStore.receitas.length === 0"
      class="text-center py-5"
    >
      <div class="alert alert-info">
        <i class="bi bi-info-circle-fill"></i>
        {{ mensagemNenhumResultado }}
      </div>
    </div>

    <nav v-if="receitaStore.paginacao.totalPaginas > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: receitaStore.paginacao.pagina === 1 }"
        >
          <button
            class="page-link"
            @click="mudarPagina(receitaStore.paginacao.pagina - 1)"
          >
            Anterior
          </button>
        </li>
        <li
          v-for="page in totalPagesToShow"
          :key="page"
          class="page-item"
          :class="{ active: page === receitaStore.paginacao.pagina }"
        >
          <button class="page-link" @click="mudarPagina(page)">
            {{ page }}
          </button>
        </li>
        <li
          class="page-item"
          :class="{
            disabled:
              receitaStore.paginacao.pagina ===
              receitaStore.paginacao.totalPaginas,
          }"
        >
          <button
            class="page-link"
            @click="mudarPagina(receitaStore.paginacao.pagina + 1)"
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>

    <ReceitaFormModal
      v-model="formModalAberto"
      :receita-para-edicao="receitaEditando"
    />

    <ReceitaModal
      v-model="modalAberto"
      :receita="receitaStore.receitaSelecionada"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useReceitaStore } from "../stores/receita.store";
import ReceitaCard from "../components/ReceitaCard.vue";
import ReceitaModal from "../components/ReceitaModal.vue";
import ReceitaFormModal from "../components/ReceitaFormModal.vue";
import { useCategoriaStore } from "../stores/categoria.store";
import type { Receita } from "../types/Receita";
import { debounce } from "lodash-es";

const receitaStore = useReceitaStore();
const categoriaStore = useCategoriaStore();

const modalAberto = ref(false);
const formModalAberto = ref(false);
const receitaEditando = ref<Receita | null>(null);
const loadingBusca = ref(false);

const mensagemNenhumResultado = computed(() => {
  if (receitaStore.termoBusca && receitaStore.termoBusca.trim() !== "") {
    return `Nenhuma receita encontrada para "${receitaStore.termoBusca}"`;
  }
  return "Nenhuma receita cadastrada ainda.";
});

const termoBusca = computed({
  get: () => receitaStore.termoBusca,
  set: (value) => (receitaStore.termoBusca = value),
});

const debouncedSearch = debounce(() => {
  buscarReceitas();
}, 300);

watch(
  () => receitaStore.termoBusca,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      receitaStore.paginacao.pagina = 1;
      debouncedSearch();
    }
  }
);

const buscarReceitas = async () => {
  loadingBusca.value = true;
  try {
    await receitaStore.carregarReceitas(
      receitaStore.paginacao.pagina,
      receitaStore.paginacao.limite,
      receitaStore.termoBusca
    );
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
  } finally {
    loadingBusca.value = false;
  }
};

const totalPagesToShow = computed(() => {
  const pages = [];
  const total = receitaStore.paginacao.totalPaginas;
  const current = receitaStore.paginacao.pagina;

  for (
    let i = Math.max(1, current - 2);
    i <= Math.min(total, current + 2);
    i++
  ) {
    pages.push(i);
  }
  return pages;
});

const mudarPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= receitaStore.paginacao.totalPaginas) {
    receitaStore.paginacao.pagina = pagina;
    buscarReceitas();
  }
};

const abrirFormulario = () => {
  receitaEditando.value = null;
  formModalAberto.value = true;
};

const visualizarReceita = async (id: number) => {
  await receitaStore.carregarReceita(id);
  modalAberto.value = true;
};

const editarReceita = (receita: Receita) => {
  receitaEditando.value = receita;
  formModalAberto.value = true;
};

const excluirReceita = async (id: number) => {
  await receitaStore.removerReceita(id);
  await buscarReceitas(); // Recarrega com os filtros atuais
};

onMounted(async () => {
  try {
    await Promise.all([buscarReceitas(), categoriaStore.carregarCategorias()]);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});
</script>

<style scoped>
.pagination {
  flex-wrap: wrap;
}

.page-item {
  margin: 2px;
}

.btn-default {
  background-color: #f59c00;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-default:hover {
  filter: brightness(0.9);
}

.alert-info {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
  max-width: 500px;
  margin: 0 auto;
}

.bi-info-circle-fill {
  margin-right: 8px;
}
</style>
