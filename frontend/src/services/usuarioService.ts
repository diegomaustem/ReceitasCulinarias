import api from "./api";
import type { Usuario } from "../types/Usuario";
import type { Paginacao } from "../types/Paginacao";

export const buscarUsuarios = async (
  pagina: number,
  limite: number
): Promise<{ dados: Usuario[]; paginacao: Paginacao }> => {
  const response = await api.get("/usuarios", { params: { pagina, limite } });
  return response.data;
};

export const buscarUsuario = async (id: number): Promise<Usuario> => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data.dados;
};

export const criarUsuario = async (usuario: Omit<Usuario, "id">) => {
  const response = await api.post("/usuarios", usuario);
  return response.data;
};

export const atualizarUsuario = async (
  id: number,
  usuario: Partial<Usuario>
) => {
  const response = await api.patch(`/usuarios/${id}`, usuario);
  return response.data;
};

export const excluirUsuario = async (id: number) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};
