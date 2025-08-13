import { Request, Response } from "express";
import { IPaginacao } from "../interfaces/IPaginacao";
import { IReceita } from "../interfaces/Receita/IReceita";
import { IReceitaService } from "../interfaces/Receita/IReceitaService";
import HttpError from "../errors/HttpError";

export class ReceitaController {
  constructor(private readonly servico: IReceitaService) {}

  listarReceitas = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginacao: IPaginacao = {
        pagina: parseInt(String(req.query.pagina)) || 1,
        limite: parseInt(String(req.query.limite)) || 10,
        busca: req.query.busca ? String(req.query.busca) : undefined,
      };
      const receitas = await this.servico.listarReceitas(paginacao);
      res.status(200).json({ code: "SUCCESS", ...receitas });
    } catch (error) {
      console.error("[Controller] - Erro ao buscar receitas.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar receitas. Tente mais tarde.",
      });
    }
  };

  listarReceita = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        code: "MISSING_USER_ID",
        mensagem: "ID do usuário não fornecido.",
      });
      return;
    }

    try {
      const receita = await this.servico.listarReceita(parseInt(id));
      if (!receita) {
        res.status(404).json({
          code: "RESOURCE_NOT_FOUND",
          mensagem: "Receita não encontrada.",
        });
        return;
      }

      res.status(200).json({
        code: "SUCCESS",
        dados: receita,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao buscar receita.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar receita. Tente mais tarde.",
      });
    }
  };

  criarReceita = async (req: Request, res: Response): Promise<void> => {
    const receita: IReceita = req.body;
    try {
      const novaReceita = await this.servico.criarReceita(receita);
      res.status(201).json({
        code: "SUCCESS",
        mensagem: "Receita criada com sucesso.",
        dados: novaReceita,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao criar receita.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao criar receita. Tente mais tarde.",
      });
    }
  };

  atualizarReceita = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        code: "MISSING_RECIPE_ID",
        mensagem: "ID da receita não fornecido.",
      });
      return;
    }
    const receita: IReceita = req.body;

    try {
      const receitaEncontrada = await this.servico.listarReceita(parseInt(id));
      if (!receitaEncontrada) {
        res.status(404).json({
          code: "RESOURCE_NOT_FOUND",
          mensagem: "Receita não encontrada para atualizar.",
        });
        return;
      }

      const receitaAtualizada = await this.servico.atualizarReceita(
        parseInt(id),
        receita
      );
      res.status(200).json({
        code: "SUCCESS",
        mensagem: "Receita atualizada com sucesso.",
        dados: receitaAtualizada,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao atualizar receita.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao atualizar receita.",
      });
    }
  };

  excluirReceita = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        code: "MISSING_RECIPE_ID",
        mensagem: "ID da receita não fornecido.",
      });
      return;
    }

    try {
      const receitaEncontrada = await this.servico.listarReceita(parseInt(id));
      if (!receitaEncontrada) {
        res.status(404).json({
          code: "RESOURCE_NOT_FOUND",
          mensagem: "Receita não encontrada para exclusão.",
        });
        return;
      }

      const receitaExcluida = await this.servico.excluirReceita(parseInt(id));
      res.status(200).json({
        code: "SUCCESS",
        mensagem: "Receita excluída com sucesso.",
        dados: receitaExcluida,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao excluir receita.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao excluir receita.",
      });
    }
  };
}
