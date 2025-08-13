import api from "../services/api";
import { defineStore } from "pinia";
import type { CredenciaisLogin } from "../types/CredenciaisLogin";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    tokenAcesso: localStorage.getItem("tokenAcesso") || null,
    usuarioLogado: JSON.parse(localStorage.getItem("usuarioLogado") || "null"),
    carregando: false,
  }),

  getters: {
    autenticado: (state) => !!state.tokenAcesso,
    nomeUsuario: (state) => state.usuarioLogado?.nome || "Usuário",
  },

  actions: {
    async fazerLogin(credenciais: CredenciaisLogin) {
      this.carregando = true;
      try {
        const response = await api.post("/login", credenciais);
        this.tokenAcesso = response.data.tokenAcesso;
        this.usuarioLogado = response.data.usuarioLogado;
        this.salvarDados();
        return true;
      } catch (error) {
        throw error;
      } finally {
        this.carregando = false;
      }
    },

    salvarDados(): void {
      if (this.tokenAcesso) {
        localStorage.setItem("tokenAcesso", this.tokenAcesso);
      }
      if (this.usuarioLogado) {
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify(this.usuarioLogado)
        );
      }
    },

    logout(): void {
      this.carregando = true;
      try {
        this.tokenAcesso = null;
        this.usuarioLogado = null;
        localStorage.removeItem("tokenAcesso");
        localStorage.removeItem("usuarioLogado");
      } finally {
        this.carregando = false;
      }
    },
  },
});
