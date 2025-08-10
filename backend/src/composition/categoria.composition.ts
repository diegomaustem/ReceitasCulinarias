import { CategoriaController } from "../controllers/CategoriaController";
import { ServicoCategoria } from "../services/ServicoCategoria";
import { RepositorioCategoriaPrisma } from "../repositories/RepositorioCategoriaPrisma";
import prisma from "../lib/prismaClient";

export function criarCategoriaController(): CategoriaController {
  const repoCategoria = new RepositorioCategoriaPrisma(prisma);
  const servico = new ServicoCategoria(repoCategoria);
  return new CategoriaController(servico);
}
