import { IPaginacao } from "../interfaces/IPaginacao";
import { ICategoria } from "../interfaces/Categoria/ICategoria";
import { ICategoriaRepository } from "../interfaces/Categoria/ICategoriaRepository";
import { IResultadoPaginado } from "../interfaces/IResultadoPaginado";
import prisma from "../lib/prismaClient";

export class RepositorioCategoriaPrisma implements ICategoriaRepository {
  async listarCategorias(
    paginacao: IPaginacao
  ): Promise<IResultadoPaginado<ICategoria>> {
    const { pagina, limite } = paginacao;
    try {
      const [dados, total] = await Promise.all([
        prisma.categoria.findMany({
          skip: (pagina - 1) * limite,
          take: limite,
          orderBy: { id: "asc" },
        }),
        prisma.categoria.count(),
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
      return await prisma.categoria.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`[Repository] - Erro ao buscar categoria ID ${id}`, error);
      throw error;
    }
  }
}
