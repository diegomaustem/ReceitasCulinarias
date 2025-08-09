import { Request, Response } from "express";
import { IPaginacao } from "../interfaces/IPaginacao";
import { ServicoCategoria } from "../services/ServicoCategoria";
import { RepositorioCategoriaPrisma } from "../repositories/RepositorioCategoriaPrisma";
import HttpError from "../errors/HttpError";

class CategoriaController {
  private servico: ServicoCategoria;

  constructor() {
    this.servico = new ServicoCategoria(new RepositorioCategoriaPrisma());
  }

  listarCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginacao: IPaginacao = {
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 10,
      };

      const categorias = await this.servico.listarCategorias(paginacao);

      res.status(200).json({
        status: "sucesso",
        ...categorias,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao buscar categorias.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          status: "erro",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        status: "erro",
        mensagem: "Erro interno ao buscar categorias. Tente mais tarde.",
      });
    }
  };

  listarCategoria = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        res
          .status(400)
          .json({ status: "erro", mensagem: "ID da categoria não informado." });
        return;
      }

      const categoria = await this.servico.listarCategoria(parseInt(id));
      categoria
        ? res.status(200).json({ status: "sucesso", dados: categoria })
        : res
            .status(404)
            .json({ status: "erro", mensagem: "Categoria não encontrada." });
    } catch (error) {
      console.error("[Controller] - Falha ao buscar categoria.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          status: "erro",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        status: "erro",
        mensagem: "Erro interno ao buscar categorias. Tente mais tarde.",
      });
    }
  };
}

export const categoriaController = new CategoriaController();
