import { ILogin } from "./ILogin";
import { IUsuario } from "./IUsuario";
import { IPaginacao } from "../IPaginacao";
import { IResultadoPaginado } from "../IResultadoPaginado";

export interface IUsuarioService {
  listarUsuarios(paginacao: IPaginacao): Promise<IResultadoPaginado<IUsuario>>;

  listarUsuario(id: number): Promise<IUsuario | null>;

  criarUsuario(usuario: IUsuario): Promise<IUsuario>;

  atualizarUsuario(id: number, usuario: IUsuario): Promise<IUsuario>;

  excluirUsuario(id: number): Promise<IUsuario>;

  encontrarUsuarioPorLogin(login: ILogin): Promise<IUsuario>;
}
