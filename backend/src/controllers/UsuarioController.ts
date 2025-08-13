import { Request, Response } from "express";
import { IPaginacao } from "../interfaces/IPaginacao";
import HttpError from "../errors/HttpError";
import { IUsuario } from "../interfaces/Usuario/IUsuario";
import { IUsuarioService } from "../interfaces/Usuario/IUsuarioService";

export class UsuarioController {
  constructor(private readonly servico: IUsuarioService) {}

  listarUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginacao: IPaginacao = {
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 10,
      };
      const usuarios = await this.servico.listarUsuarios(paginacao);
      res.status(200).json({ code: "SUCCESS", ...usuarios });
    } catch (error) {
      console.error("[Controller] - Erro ao buscar usuários.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar usuários. Tente mais tarde.",
      });
    }
  };

  listarUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        code: "MISSING_USER_ID",
        mensagem: "ID do usuário não fornecido.",
      });
      return;
    }

    try {
      const usuario = await this.servico.listarUsuario(parseInt(id));
      if (!usuario) {
        res.status(404).json({
          code: "RESOURCE_NOT_FOUND",
          mensagem: "Usuário não encontrado.",
        });
        return;
      }

      res.status(200).json({
        code: "SUCCESS",
        dados: usuario,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao buscar usuário.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar usuário. Tente mais tarde.",
      });
    }
  };

  criarUsuario = async (req: Request, res: Response): Promise<void> => {
    const usuario: IUsuario = req.body;
    try {
      const novoUsuario = await this.servico.criarUsuario(usuario);
      res.status(201).json({
        code: "SUCCESS",
        mensagem: "Usuário criado com sucesso.",
        dados: novoUsuario,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao criar usuário.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao criar usuário. Tente mais tarde.",
      });
    }
  };

  atualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        code: "MISSING_USER_ID",
        mensagem: "ID do usuário não fornecido.",
      });
      return;
    }
    const usuario: IUsuario = req.body;

    try {
      const usuarioEncontrado = await this.servico.listarUsuario(parseInt(id));
      if (!usuarioEncontrado) {
        res.status(404).json({
          code: "RESOURCE_NOT_FOUND",
          mensagem: "Usuário não encontrado para atualizar.",
        });
        return;
      }

      const usuarioAtualizado = await this.servico.atualizarUsuario(
        parseInt(id),
        usuario
      );
      res.status(200).json({
        status: "SUCCESS",
        mensagem: "Usuário atualizado com sucesso.",
        dados: usuarioAtualizado,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao atualiza usuário.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao atualizar usuário.",
      });
    }
  };

  excluirUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        code: "MISSING_USER_ID",
        mensagem: "ID do usuário não fornecido.",
      });
      return;
    }
    try {
      const usuarioEncontrado = await this.servico.listarUsuario(parseInt(id));
      if (!usuarioEncontrado) {
        res.status(404).json({
          code: "RESOURCE_NOT_FOUND",
          mensagem: "Usuário não encontrado para exclusão.",
        });
        return;
      }

      const usuarioExcluido = await this.servico.excluirUsuario(parseInt(id));
      res.status(200).json({
        code: "SUCCESS",
        mensagem: "Usuário excluído com sucesso.",
        dados: usuarioExcluido,
      });
    } catch (error) {
      console.error("[Controller] - Erro ao excluir usuário.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao excluir usuário.",
      });
    }
  };
}
