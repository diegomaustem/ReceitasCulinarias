import { IReceita } from "../interfaces/Receita/IReceita";
import { IPaginacao } from "../interfaces/IPaginacao";
import { IUsuarioRepository } from "../interfaces/Usuario/IUsuarioRepository";
import { IReceitaRepository } from "../interfaces/Receita/IReceitaRepository";
import { ICategoriaRepository } from "../interfaces/Categoria/ICategoriaRepository";
import HttpError from "../errors/HttpError";
import { IReceitaService } from "../interfaces/Receita/IReceitaService";

export class ServicoReceita implements IReceitaService {
  constructor(
    private readonly repository: IReceitaRepository,
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly categoriaRepository: ICategoriaRepository
  ) {}

  async listarReceitas(paginacao: IPaginacao) {
    try {
      if (paginacao.pagina <= 0 || paginacao.limite <= 0) {
        throw new HttpError("Parâmetros de paginação inválidos.", 400);
      }
      return await this.repository.listarReceitas(paginacao);
    } catch (error) {
      console.error("[Service] - Falha ao buscar receitas.", error);
      throw error;
    }
  }

  async listarReceita(id: number): Promise<IReceita | null> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new HttpError("ID do receita inválido.", 400);
      }
      return await this.repository.listarReceita(id);
    } catch (error) {
      console.error("[Service] - Falha ao buscar receita.", error);
      throw error;
    }
  }

  async criarReceita(receita: IReceita): Promise<IReceita> {
    try {
      await this.validarRegrasReceita(receita);
      console.log("Passou");
      return await this.repository.criarReceita(receita);
    } catch (error) {
      console.error("[Service] - Falha ao criar receita.", error);
      throw error;
    }
  }

  async atualizarReceita(id: number, receita: IReceita): Promise<IReceita> {
    try {
      await this.validarRegrasReceita(receita);
      return await this.repository.atualizarReceita(id, receita);
    } catch (error) {
      console.error("[Service] - Falha ao atualizar receita.", error);
      throw error;
    }
  }

  async excluirReceita(id: number): Promise<IReceita> {
    try {
      return await this.repository.excluirReceita(id);
    } catch (error) {
      console.error("[Service] - Falha ao excluir receita.", error);
      throw error;
    }
  }

  private async validarRegrasReceita(receita: IReceita): Promise<void> {
    const { idUsuarios, idCategorias } = receita;
    if (idUsuarios) {
      const usuarios = await this.usuarioRepository.listarUsuario(idUsuarios);

      if (!usuarios) {
        throw new HttpError(
          "ID de usuário inválido. Nenhum usuário foi encontrado com o ID fornecido.",
          404
        );
      }
    }

    if (idCategorias) {
      const categoria = await this.categoriaRepository.listarCategoria(
        idCategorias
      );

      if (!categoria) {
        throw new HttpError(
          "ID de categoria inválido. Nenhuma categoria foi encontrada com o ID fornecido.",
          404
        );
      }
    }
  }
}
