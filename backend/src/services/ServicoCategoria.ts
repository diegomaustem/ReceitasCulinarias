import { ICategoria } from "../interfaces/ICategoria";
import { IPaginacao } from "../interfaces/IPaginacao";
import { ICategoriaRepository } from "../interfaces/ICategoriaRepository";
import { ICategoriaService } from "../interfaces/ICategoriaService";
import HttpError from "../errors/HttpError";

export class ServicoCategoria implements ICategoriaService {
  constructor(private repository: ICategoriaRepository) {}

  async listarCategorias(paginacao: IPaginacao) {
    if (paginacao.pagina <= 0 || paginacao.limite <= 0) {
      throw new HttpError("Parâmetros de paginação inválidos.", 400);
    }
    return this.repository.listarCategorias(paginacao);
  }

  async listarCategoria(id: number): Promise<ICategoria | null> {
    if (!id || isNaN(id) || id <= 0) {
      throw new HttpError("ID da categoria inválido.", 400);
    }
    return this.repository.listarCategoria(id);
  }
}
