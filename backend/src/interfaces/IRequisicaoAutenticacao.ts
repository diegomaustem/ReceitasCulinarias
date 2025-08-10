import jwt from "jsonwebtoken";
import { Request } from "express";

export interface IRequisicaoAutenticacao extends Request {
  usuario?: string | jwt.JwtPayload;
}
