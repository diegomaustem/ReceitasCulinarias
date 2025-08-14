import api from "./api";
import type { Receita } from "../types/Receita";

export const buscarReceitas = async (
  pagina: number,
  limite: number,
  busca?: string
) => {
  const params = {
    pagina,
    limite,
    ...(busca && { busca }),
  };

  const response = await api.get("/receitas", { params });
  return {
    dados: response.data.dados,
    paginacao: response.data.paginacao,
  };
};

export const buscarReceita = async (id: number): Promise<Receita> => {
  const response = await api.get(`/receitas/${id}`);
  return response.data.dados;
};

export const criarReceita = async (receita: Omit<Receita, "id">) => {
  const response = await api.post("/receitas", {
    ...receita,
    idCategorias: receita.idCategorias || null,
  });
  return response.data;
};

export const atualizarReceita = async (
  id: number,
  receita: Partial<Receita>
) => {
  const response = await api.patch(`/receitas/${id}`, {
    ...receita,
    idCategorias: receita.idCategorias || null,
  });
  return response.data;
};

export const excluirReceita = async (id: number) => {
  const response = await api.delete(`/receitas/${id}`);
  return response.data;
};
