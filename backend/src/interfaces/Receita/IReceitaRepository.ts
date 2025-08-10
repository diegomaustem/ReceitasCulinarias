import { IPaginacao } from "../IPaginacao";
import { IResultadoPaginado } from "../IResultadoPaginado";
import { IReceita } from "./IReceita";

export interface IReceitaRepository {
  listarReceitas(paginacao: IPaginacao): Promise<IResultadoPaginado<IReceita>>;

  listarReceita(id: number): Promise<IReceita | null>;

  criarReceita(receita: IReceita): Promise<IReceita>;

  atualizarReceita(id: number, receita: IReceita): Promise<IReceita>;

  excluirReceita(id: number): Promise<IReceita>;

  usuarioPossuiReceita(id: number): Promise<boolean>;
}
