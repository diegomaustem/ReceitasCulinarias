import { IPaginacao } from "../interfaces/IPaginacao";
import { IUsuario } from "../interfaces/Usuario/IUsuario";
import { IResultadoPaginado } from "../interfaces/IResultadoPaginado";
import { IUsuarioRepository } from "../interfaces/Usuario/IUsuarioRepository";
import { PrismaClient } from "../generated/prisma/client";

export class RepositorioUsuarioPrisma implements IUsuarioRepository {
  constructor(private prisma: PrismaClient) {}

  async listarUsuarios(
    paginacao: IPaginacao
  ): Promise<IResultadoPaginado<IUsuario>> {
    const { pagina, limite } = paginacao;
    try {
      const [dados, total] = await Promise.all([
        this.prisma.usuario.findMany({
          skip: (pagina - 1) * limite,
          take: limite,
          orderBy: { id: "asc" },
        }),
        this.prisma.usuario.count(),
      ]);

      return {
        dados,
        paginacao: {
          total,
          pagina,
          limite,
          totalPaginas: Math.ceil(total / limite),
        },
      };
    } catch (error) {
      console.error("[Repository] - Erro ao buscar usuários.", error);
      throw error;
    }
  }

  async listarUsuario(id: number): Promise<IUsuario | null> {
    try {
      return await this.prisma.usuario.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`[Repository] - Erro ao buscar usuário ID ${id}`, error);
      throw error;
    }
  }

  async criarUsuario(usuario: IUsuario): Promise<IUsuario> {
    try {
      return await this.prisma.usuario.create({
        data: usuario,
      });
    } catch (error) {
      console.error("[Repository] - Erro ao criar usuário.", error);
      throw error;
    }
  }

  async atualizarUsuario(id: number, usuario: IUsuario): Promise<IUsuario> {
    try {
      return await this.prisma.usuario.update({
        where: { id },
        data: usuario,
      });
    } catch (error) {
      console.error("[Repository] - Erro ao atualizar usuário.", error);
      throw error;
    }
  }

  async excluirUsuario(id: number): Promise<IUsuario> {
    try {
      return await this.prisma.usuario.delete({
        where: { id },
      });
    } catch (error) {
      console.error("[Repository]- Erro ao excluir usuário.", error);
      throw error;
    }
  }

  async encontrarUsuarioPorLogin(login: string): Promise<IUsuario | null> {
    try {
      return await this.prisma.usuario.findFirst({
        where: {
          login,
        },
      });
    } catch (error) {
      console.error("[Repository] - Erro ao buscar usuário por login.", error);
      throw error;
    }
  }
}
