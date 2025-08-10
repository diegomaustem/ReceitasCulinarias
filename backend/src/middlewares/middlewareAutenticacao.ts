import { Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { IRequisicaoAutenticacao } from "../interfaces/IRequisicaoAutenticacao";

export const auth = (
  req: IRequisicaoAutenticacao,
  res: Response,
  next: NextFunction
) => {
  const chaveSecreta = process.env.SECRET_KEY as Secret;

  if (!chaveSecreta) {
    console.error(
      "[MiddleAuth] - Erro de configuração: SECRET_KEY não definida."
    );
    res.status(500).json({
      status: "erro",
      mensagem: "Erro interno do servidor. Tente novamente mais tarde.",
    });
    return;
  }

  const cabecalhoAutenticacao = req.headers.authorization;

  if (!cabecalhoAutenticacao || !cabecalhoAutenticacao.startsWith("Bearer ")) {
    res.status(401).json({
      status: "erro",
      mensagem: "Token de autenticação ausente ou no formato incorreto.",
    });
    return;
  }

  const token = cabecalhoAutenticacao.split(" ")[1];

  if (token) {
    try {
      const decodificado = jwt.verify(token, chaveSecreta);
      req.usuario = decodificado;
      return next();
    } catch (err) {
      res.status(401).json({
        status: "erro",
        mensagem: "Token inválido ou expirado.",
      });
    }
  } else {
    res.status(401).json({
      status: "erro",
      mensagem: "Token não fornecido.",
    });
  }
};
