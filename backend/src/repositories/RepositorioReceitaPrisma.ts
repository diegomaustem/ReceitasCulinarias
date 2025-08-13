import { IReceita } from "../interfaces/Receita/IReceita";
import { IReceitaRepository } from "../interfaces/Receita/IReceitaRepository";
import { IPaginacao } from "../interfaces/IPaginacao";
import { IResultadoPaginado } from "../interfaces/IResultadoPaginado";
import { PrismaClient } from "../generated/prisma/client";

export class RepositorioReceitaPrisma implements IReceitaRepository {
  constructor(private prisma: PrismaClient) {}
  async listarReceitas(
    paginacao: IPaginacao
  ): Promise<IResultadoPaginado<IReceita>> {
    const { pagina, limite } = paginacao;
    try {
      const { busca } = paginacao;
      const where = busca
        ? {
            nome: {
              contains: busca,
            },
          }
        : {};

      const [dados, total] = await Promise.all([
        this.prisma.receita.findMany({
          where: busca
            ? {
                nome: {
                  contains: busca,
                },
              }
            : {},
          skip: (pagina - 1) * limite,
          take: limite,
          orderBy: { id: "asc" },
        }),
        this.prisma.receita.count({ where }),
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
      console.error("[Repository] - Erro ao buscar receitas.", error);
      throw error;
    }
  }

  async listarReceita(id: number): Promise<IReceita | null> {
    try {
      return await this.prisma.receita.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`[Repository] - Erro ao buscar receita ID ${id}`, error);
      throw error;
    }
  }

  async criarReceita(receita: IReceita): Promise<IReceita> {
    try {
      return await this.prisma.receita.create({
        data: receita,
      });
    } catch (error) {
      console.error("[Repository] - Erro ao criar receita.", error);
      throw error;
    }
  }

  async atualizarReceita(id: number, receita: IReceita): Promise<IReceita> {
    try {
      return await this.prisma.receita.update({
        where: { id },
        data: receita,
      });
    } catch (error) {
      console.error("[Repository] - Erro ao atualizar receita.", error);
      throw error;
    }
  }

  async excluirReceita(id: number): Promise<IReceita> {
    try {
      return await this.prisma.receita.delete({
        where: { id },
      });
    } catch (error) {
      console.error("[Repository]- Erro ao excluir receita.", error);
      throw error;
    }
  }

  async usuarioPossuiReceita(id: number): Promise<boolean> {
    try {
      const temReceita = await this.prisma.receita.findFirst({
        where: {
          idUsuarios: id,
        },
      });
      return !!temReceita;
    } catch (error) {
      console.error("[Repository]- Erro ao buscar receita de usuário.", error);
      throw error;
    }
  }
}
