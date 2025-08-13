import api from "./api";
import type { Receita } from "../types/Receita";
import type { Paginacao } from "../types/Paginacao";

export const fetchReceitas = async (
  pagina: number,
  limite: number
): Promise<{ dados: Receita[]; paginacao: Paginacao }> => {
  const response = await api.get("/receitas", {
    params: { pagina, limite },
  });
  return response.data;
};

export const fetchReceitaById = async (id: number): Promise<Receita> => {
  const response = await api.get(`/receitas/${id}`);
  return response.data.dados;
};

export const createReceita = async (receita: Omit<Receita, "id">) => {
  const response = await api.post("/receitas", {
    ...receita,
    idCategorias: receita.idCategorias || null,
  });
  return response.data;
};

export const updateReceita = async (id: number, receita: Partial<Receita>) => {
  const response = await api.patch(`/receitas/${id}`, {
    ...receita,
    idCategorias: receita.idCategorias || null,
  });
  return response.data;
};

export const deleteReceita = async (id: number) => {
  const response = await api.delete(`/receitas/${id}`);
  return response.data;
};
