import { IUsuario } from "../interfaces/Usuario/IUsuario";
import { IPaginacao } from "../interfaces/IPaginacao";
import HttpError from "../errors/HttpError";
import { ILogin } from "../interfaces/Usuario/ILogin";
import { utilsSenha } from "../utils/UtilsSenha";
import { IUsuarioRepository } from "../interfaces/Usuario/IUsuarioRepository";
import { IReceitaRepository } from "../interfaces/Receita/IReceitaRepository";
import { IUsuarioService } from "../interfaces/Usuario/IUsuarioService";
import { IResultadoPaginado } from "../interfaces/IResultadoPaginado";

export class ServicoUsuario implements IUsuarioService {
  constructor(
    private readonly repository: IUsuarioRepository,
    private readonly receitaRepository: IReceitaRepository
  ) {}

  async listarUsuarios(
    paginacao: IPaginacao
  ): Promise<IResultadoPaginado<IUsuario>> {
    try {
      if (paginacao.pagina <= 0 || paginacao.limite <= 0) {
        throw new HttpError("Parâmetros de paginação inválidos.", 400);
      }
      return await this.repository.listarUsuarios(paginacao);
    } catch (error) {
      console.error("[Service] - Falha ao buscar usuários.", error);
      throw error;
    }
  }

  async listarUsuario(id: number): Promise<IUsuario | null> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new HttpError("ID do usuário inválido.", 400);
      }
      return await this.repository.listarUsuario(id);
    } catch (error) {
      console.error("[Service] - Falha ao buscar usuário.", error);
      throw error;
    }
  }

  async criarUsuario(usuario: IUsuario): Promise<IUsuario> {
    try {
      await this.validarLogin(usuario.login);

      const senhaComHash = await utilsSenha.hashSenha(usuario.senha);
      const novoUsuario: IUsuario = {
        ...usuario,
        senha: senhaComHash,
      };
      return await this.repository.criarUsuario(novoUsuario);
    } catch (error) {
      console.error("[Service] - Falha ao criar usuário.", error);
      throw error;
    }
  }

  async atualizarUsuario(id: number, usuario: IUsuario): Promise<IUsuario> {
    try {
      await this.validarLogin(usuario.login, id);

      let usuarioAtualizar = { ...usuario };
      if (usuarioAtualizar.senha) {
        usuarioAtualizar.senha = await utilsSenha.hashSenha(
          usuarioAtualizar.senha
        );
      }
      return await this.repository.atualizarUsuario(id, usuarioAtualizar);
    } catch (error) {
      console.error("[Service] - Falha ao atualizar usuário.", error);
      throw error;
    }
  }

  async excluirUsuario(id: number): Promise<IUsuario> {
    try {
      await this.validarExclusao(id);
      return await this.repository.excluirUsuario(id);
    } catch (error) {
      console.error("[Service] - Falha ao excluir usuário.", error);
      throw error;
    }
  }

  async encontrarUsuarioPorLogin(loginn: ILogin): Promise<IUsuario> {
    const { login } = loginn;
    try {
      const usuario = await this.repository.encontrarUsuarioPorLogin(login);
      if (!usuario) {
        throw new HttpError("Usuário não encontrado em nossos registros.", 404);
      }
      return usuario;
    } catch (error) {
      console.error("[Service] - Falha ao buscar por login de usuário.", error);
      throw error;
    }
  }

  private async validarLogin(login: string, id?: number): Promise<void> {
    if (!login) {
      return;
    }
    const usuario = await this.repository.encontrarUsuarioPorLogin(login);
    if (usuario) {
      if (!id || usuario.id !== id) {
        throw new HttpError(
          "O login fornecido já está em uso. Por favor, escolha outro.",
          409
        );
      }
    }
  }

  private async validarExclusao(id: number): Promise<void> {
    const usuarioTemReceita = await this.receitaRepository.usuarioPossuiReceita(
      id
    );

    if (usuarioTemReceita) {
      throw new HttpError(
        "O usuário possui receitas e não pode ser excluído.",
        409
      );
    }
  }
}
