import { IPaginacao } from "../interfaces/IPaginacao";
import { ICategoria } from "../interfaces/Categoria/ICategoria";
import { ICategoriaRepository } from "../interfaces/Categoria/ICategoriaRepository";
import { IResultadoPaginado } from "../interfaces/IResultadoPaginado";
import { PrismaClient } from "../generated/prisma/client";

export class RepositorioCategoriaPrisma implements ICategoriaRepository {
  constructor(private prisma: PrismaClient) {}
  async listarCategorias(
    paginacao: IPaginacao
  ): Promise<IResultadoPaginado<ICategoria>> {
    const { pagina, limite } = paginacao;
    try {
      const [dados, total] = await Promise.all([
        this.prisma.categoria.findMany({
          skip: (pagina - 1) * limite,
          take: limite,
          orderBy: { id: "asc" },
        }),
        this.prisma.categoria.count(),
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
      console.error("[Repository] - Erro ao buscar categorias.", error);
      throw error;
    }
  }

  async listarCategoria(id: number): Promise<ICategoria | null> {
    try {
      return await this.prisma.categoria.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`[Repository] - Erro ao buscar categoria ID ${id}`, error);
      throw error;
    }
  }
}
