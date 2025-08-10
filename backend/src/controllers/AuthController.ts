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
          status: "erro",
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
        expiresIn: "2h",
      });

      res.status(200).json({
        status: "sucesso",
        mensagem: "Usuário logado com sucesso.",
        loggedUser: {
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
          status: "erro",
          mensagem: error.mensagem,
        });
        return;
      }

      res.status(500).json({
        status: "erro",
        mensagem: "Erro interno no processo de login. Tente mais tarde.",
      });
    }
  };
}
