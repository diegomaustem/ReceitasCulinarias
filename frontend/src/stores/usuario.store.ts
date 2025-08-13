import { defineStore } from "pinia";
import type { Usuario } from "../types/Usuario";
import type { Paginacao } from "../types/Paginacao";
import {
  buscarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "../services/usuarioService";

import Swal from "sweetalert2";
import { renderizarErros } from "../utils/renderizaErros";

export const useUsuarioStore = defineStore("usuario", {
  state: () => ({
    usuarios: [] as Usuario[],
    usuarioSelecionado: null as Usuario | null,
    paginacao: {
      total: 0,
      pagina: 1,
      limite: 10,
      totalPaginas: 1,
    } as Paginacao,
    loading: false,
    mensagemErro: null as string | null,
  }),

  actions: {
    async carregarUsuarios(pagina: number) {
      this.loading = true;
      try {
        const { dados, paginacao } = await buscarUsuarios(
          pagina,
          this.paginacao.limite
        );
        this.usuarios = dados;
        this.paginacao = paginacao;
        this.mensagemErro = null;
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      } finally {
        this.loading = false;
      }
    },

    async carregarUsuario(id: number) {
      try {
        this.usuarioSelecionado = await buscarUsuario(id);
        this.mensagemErro = null;
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      }
    },

    async adicionarUsuario(usuario: Omit<Usuario, "id">) {
      try {
        const response = await criarUsuario(usuario);
        await this.carregarUsuarios(this.paginacao.pagina);
        exibeSucesso(response.mensagem);
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      }
    },

    async atualizarUsuario(id: number, usuario: Partial<Usuario>) {
      try {
        const response = await atualizarUsuario(id, usuario);
        await this.carregarUsuarios(this.paginacao.pagina);
        exibeSucesso(response.mensagem);
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      }
    },

    async excluirUsuario(id: number) {
      const result = await Swal.fire({
        title: "Excluir! Tem certeza?",
        text: "Você não poderá reverter isso!",
        showCancelButton: true,
        confirmButtonColor: "#f59c00",
        cancelButtonColor: "#20252A",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          const response = await excluirUsuario(id);
          await this.carregarUsuarios(this.paginacao.pagina);
          exibeSucesso(response.mensagem);
        } catch (error) {
          this.mensagemErro = renderizarErros(error);
          exibeErro(this.mensagemErro);
        }
      }
    },
  },
});

const exibeSucesso = (sucess: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: sucess,
  });
};

const exibeErro = (erro: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: erro,
  });
};
