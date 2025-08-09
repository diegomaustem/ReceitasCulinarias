import { ICategoria } from "./ICategoria";
import { IPaginacao } from "./IPaginacao";
import { IResultadoPaginado } from "./IResultadoPaginado";

export interface ICategoriaRepository {
  listarCategorias(
    paginacao: IPaginacao
  ): Promise<IResultadoPaginado<ICategoria>>;

  listarCategoria(id: number): Promise<ICategoria | null>;
}
