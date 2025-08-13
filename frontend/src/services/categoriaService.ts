import api from "./api";
import type { Categoria } from "../types/Categoria";

export const buscarCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get("/categorias");
    return response.data.dados;
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    throw error;
  }
};
