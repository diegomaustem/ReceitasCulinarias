import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../errors/HttpError";
import { IUsuarioService } from "../interfaces/Usuario/IUsuarioService";

export class AuthController {
  constructor(private readonly servico: IUsuarioService) {}
  login = async (req: Request, res: Response): Promise<void> => {
    const { senha } = req.body;

    try {
      const usuario = await this.servico.encontrarUsuarioPorLogin(req.body);

      const comparaSenha = await bcrypt.compare(senha, usuario.senha);
      if (!comparaSenha) {
        res.status(401).json({
          code: "ERROR_INVALID_CREDENTIALS",
          mensagem: "Credênciais inválidas.",
        });
        return;
      }

      const chaveSecreta = process.env.SECRET_KEY;
      if (!chaveSecreta) {
        throw new Error(
          "SECRET_KEY não foi definida nas variáveis de ambiente."
        );
      }

      const token = jwt.sign({ id: usuario.id }, chaveSecreta, {
        expiresIn: "5h",
      });

      res.status(200).json({
        code: "SUCCESS",
        mensagem: "Usuário logado com sucesso.",
        usuarioLogado: {
          id: usuario.id,
          nome: usuario.nome,
          login: usuario.login,
        },
        tokenAcesso: token,
      });
    } catch (error) {
      console.error("[Auth] - Erro no processo de login.", error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          code: "INTERNAL_SERVER_ERROR",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno no processo de login. Tente mais tarde.",
      });
    }
  };
}
