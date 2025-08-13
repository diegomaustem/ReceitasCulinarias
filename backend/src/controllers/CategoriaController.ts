import { Request, Response } from "express";
import { IPaginacao } from "../interfaces/IPaginacao";
import { ICategoriaService } from "../interfaces/Categoria/ICategoriaService";
import HttpError from "../errors/HttpError";

export class CategoriaController {
  constructor(private readonly servico: ICategoriaService) {}

  listarCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginacao: IPaginacao = {
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 10,
      };

      const categorias = await this.servico.listarCategorias(paginacao);
      res.status(200).json({
        code: "SUCCESS",
        ...categorias,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao buscar categorias.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          status: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        status: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar categorias. Tente mais tarde.",
      });
    }
  };

  listarCategoria = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({
          code: "MISSING_CATEGORY_ID",
          mensagem: "ID da categoria não informado.",
        });
        return;
      }

      const categoria = await this.servico.listarCategoria(parseInt(id));
      categoria
        ? res.status(200).json({ code: "SUCCESS", dados: categoria })
        : res.status(404).json({
            code: "RESOURCE_NOT_FOUND",
            mensagem: "Categoria não encontrada.",
          });
    } catch (error) {
      console.error("[Controller] - Falha ao buscar categoria.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar categorias. Tente mais tarde.",
      });
    }
  };
}
