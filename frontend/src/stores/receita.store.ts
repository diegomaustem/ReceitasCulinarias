import { defineStore } from "pinia";
import type { Receita } from "../types/Receita";
import type { Paginacao } from "../types/Paginacao";
import {
  buscarReceitas,
  buscarReceita,
  criarReceita,
  atualizarReceita,
  excluirReceita,
} from "../services/receitaService";
import { renderizarErros } from "../utils/renderizaErros";
import Swal from "sweetalert2";

export const useReceitaStore = defineStore("receita", {
  state: () => ({
    receitas: [] as Receita[],
    receitaSelecionada: null as Receita | null,
    paginacao: {
      total: 0,
      pagina: 1,
      limite: 10,
      totalPaginas: 1,
    } as Paginacao,
    loading: false,
    mensagemErro: null as string | null,
    termoBusca: "",
  }),

  actions: {
    async carregarReceitas(
      pagina: number,
      limite: number = 10,
      busca?: string
    ) {
      this.loading = true;
      this.termoBusca = busca || "";
      try {
        const { dados, paginacao } = await buscarReceitas(
          pagina,
          limite,
          busca
        );
        this.receitas = dados;
        this.paginacao = {
          ...this.paginacao,
          ...paginacao,
          pagina,
          limite,
        };
      } catch (error) {
        // ... tratamento de erro
      } finally {
        this.loading = false;
      }
    },

    async carregarReceita(id: number) {
      try {
        this.receitaSelecionada = await buscarReceita(id);
        this.mensagemErro = null;
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      }
    },

    async adicionarReceita(receita: Partial<Omit<Receita, "id">>) {
      try {
        const response = await criarReceita({
          ...receita,
          idUsuarios: receita.idUsuarios ?? null,
          idCategorias: receita.idCategorias ?? null,
          nome: receita.nome ?? null,
          ingredientes: receita.ingredientes ?? "",
          modoPreparo: receita.modoPreparo ?? "",
          tempoPreparoMinutos: receita.tempoPreparoMinutos ?? 0,
          porcoes: receita.porcoes ?? 1,
        });
        await this.carregarReceitas(this.paginacao.pagina);
        exibeSucesso(response.mensagem);
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      }
    },

    async atualizarReceita(id: number, receita: Partial<Receita>) {
      try {
        const response = await atualizarReceita(id, {
          ...receita,
          idCategorias: receita.idCategorias || null,
        });
        await this.carregarReceitas(this.paginacao.pagina);
        exibeSucesso(response.mensagem);
      } catch (error) {
        this.mensagemErro = renderizarErros(error);
        exibeErro(this.mensagemErro);
      }
    },

    async removerReceita(id: number) {
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
          const response = await excluirReceita(id);
          await this.carregarReceitas(this.paginacao.pagina);
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
