import { AuthController } from "../controllers/AuthController";
import { ServicoUsuario } from "../services/ServicoUsuario";
import { RepositorioUsuarioPrisma } from "../repositories/RepositorioUsuarioPrisma";
import prisma from "../lib/prismaClient";
import { RepositorioReceitaPrisma } from "../repositories/RepositorioReceitaPrisma";

export function criarAuthController(): AuthController {
  const repoUsuario = new RepositorioUsuarioPrisma(prisma);
  const repoReceita = new RepositorioReceitaPrisma(prisma);
  const servico = new ServicoUsuario(repoUsuario, repoReceita);
  return new AuthController(servico);
}
