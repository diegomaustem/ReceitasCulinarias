import { defineStore } from "pinia";
import { buscarCategorias } from "../services/categoriaService";
import type { Categoria } from "../types/Categoria";

export const useCategoriaStore = defineStore("categoria", {
  state: () => ({
    categorias: [] as Categoria[],
    loading: false,
  }),

  actions: {
    async carregarCategorias() {
      this.loading = true;
      try {
        this.categorias = await buscarCategorias();
      } finally {
        this.loading = false;
      }
    },
  },
});
