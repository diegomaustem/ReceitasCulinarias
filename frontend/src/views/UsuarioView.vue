<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Gerenciar Usuários</h1>
      <button
        class="btn btn-default"
        @click="abrirFormulario"
        :disabled="store.loading"
      >
        <i class="bi bi-plus-circle"></i> Adicionar Usuário
      </button>
    </div>

    <div
      v-if="store.loading && store.usuarios.length === 0"
      class="text-center py-5"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2">Carregando usuários...</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="usuario in store.usuarios" :key="usuario.id">
        <UsuarioCard
          :usuario="usuario"
          @visualizar="visualizarUsuario(usuario.id)"
          @editar="editarUsuario(usuario)"
          @excluir="excluirUsuario(usuario.id)"
          :loading="store.loading"
        />
      </div>
    </div>

    <nav v-if="store.paginacao.totalPaginas > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: store.paginacao.pagina === 1 }"
        >
          <button
            class="page-link"
            @click="mudarPagina(store.paginacao.pagina - 1)"
          >
            Anterior
          </button>
        </li>

        <li
          v-for="page in totalPagesToShow"
          :key="page"
          class="page-item"
          :class="{ active: page === store.paginacao.pagina }"
        >
          <button class="page-link" @click="mudarPagina(page)">
            {{ page }}
          </button>
        </li>

        <li
          class="page-item"
          :class="{
            disabled: store.paginacao.pagina === store.paginacao.totalPaginas,
          }"
        >
          <button
            class="page-link"
            @click="mudarPagina(store.paginacao.pagina + 1)"
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>
    <UsuarioModal v-model="modalAberto" :usuario="store.usuarioSelecionado" />

    <UsuarioFormModal
      v-model="formModalAberto"
      :usuario-para-edicao="usuarioEditando"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUsuarioStore } from "../stores/usuario.store";
import UsuarioCard from "../components/UsuarioCard.vue";
import UsuarioModal from "../components/UsuarioModal.vue";
import UsuarioFormModal from "../components/UsuarioFormModal.vue";
import type { Usuario } from "../types/Usuario";

const store = useUsuarioStore();
const modalAberto = ref(false);
const formModalAberto = ref(false);
const usuarioEditando = ref<Usuario | null>(null);

onMounted(async () => {
  await store.carregarUsuarios(1);
});

const totalPagesToShow = computed(() => {
  const total = store.paginacao.totalPaginas;
  const current = store.paginacao.pagina;
  const range = 2;

  let start = Math.max(1, current - range);
  let end = Math.min(total, current + range);

  if (current <= range + 1) {
    end = Math.min(2 * range + 1, total);
  }

  if (current >= total - range) {
    start = Math.max(total - 2 * range, 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const mudarPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= store.paginacao.totalPaginas) {
    store.carregarUsuarios(pagina);
  }
};

const abrirFormulario = () => {
  usuarioEditando.value = null;
  formModalAberto.value = true;
};

const visualizarUsuario = async (id: number) => {
  await store.carregarUsuario(id);
  modalAberto.value = true;
};

const editarUsuario = (usuario: Usuario) => {
  usuarioEditando.value = usuario;
  formModalAberto.value = true;
};

const excluirUsuario = async (id: number) => {
  await store.excluirUsuario(id);
  store.carregarUsuarios(store.paginacao.pagina);
};
</script>

<style scoped>
.pagination {
  flex-wrap: wrap;
}

.page-item {
  margin: 2px;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }
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
