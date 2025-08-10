import { ReceitaController } from "../controllers/ReceitaController";
import { RepositorioCategoriaPrisma } from "../repositories/RepositorioCategoriaPrisma";
import { RepositorioReceitaPrisma } from "../repositories/RepositorioReceitaPrisma";
import { RepositorioUsuarioPrisma } from "../repositories/RepositorioUsuarioPrisma";
import { ServicoReceita } from "../services/ServicoReceita";
import prisma from "../lib/prismaClient";

export function criarReceitaController(): ReceitaController {
  const repoReceita = new RepositorioReceitaPrisma(prisma);
  const repoUsuario = new RepositorioUsuarioPrisma(prisma);
  const repoCategoria = new RepositorioCategoriaPrisma(prisma);

  const servico = new ServicoReceita(repoReceita, repoUsuario, repoCategoria);
  return new ReceitaController(servico);
}
