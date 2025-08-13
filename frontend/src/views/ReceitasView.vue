<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Receitas</h1>
      <button
        class="btn btn-default"
        @click="abrirFormulario"
        :disabled="receitaStore.loading"
      >
        <i class="bi bi-plus-circle"></i> Nova Receita
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
import { ref, computed, onMounted } from "vue";
import { useReceitaStore } from "../stores/receita.store";
import ReceitaCard from "../components/ReceitaCard.vue";
import ReceitaModal from "../components/ReceitaModal.vue";
import ReceitaFormModal from "../components/ReceitaFormModal.vue";
import { useCategoriaStore } from "../stores/categoria.store";
import type { Receita } from "../types/Receita";

const receitaStore = useReceitaStore();
const categoriaStore = useCategoriaStore();
const modalAberto = ref(false);
const formModalAberto = ref(false);
const receitaEditando = ref<Receita | null>(null);

onMounted(async () => {
  try {
    await Promise.all([
      receitaStore.carregarReceitas(1),
      categoriaStore.carregarCategorias(),
    ]);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});

const totalPagesToShow = computed(() => {
  const pages = [];
  const total = receitaStore.paginacao.totalPaginas;
  const current = receitaStore.paginacao.pagina;

  // Lógica para mostrar páginas próximas à atual
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
    receitaStore.carregarReceitas(pagina);
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
  receitaStore.carregarReceitas(receitaStore.paginacao.pagina);
};
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
</style>
