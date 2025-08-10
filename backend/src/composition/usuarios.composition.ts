import { UsuarioController } from "../controllers/UsuarioController";
import { RepositorioReceitaPrisma } from "../repositories/RepositorioReceitaPrisma";
import { RepositorioUsuarioPrisma } from "../repositories/RepositorioUsuarioPrisma";
import { ServicoUsuario } from "../services/ServicoUsuario";
import prisma from "../lib/prismaClient";

export function criarUsuarioController(): UsuarioController {
  const repoUsuario = new RepositorioUsuarioPrisma(prisma);
  const repoReceita = new RepositorioReceitaPrisma(prisma);
  const servico = new ServicoUsuario(repoUsuario, repoReceita);
  return new UsuarioController(servico);
}
