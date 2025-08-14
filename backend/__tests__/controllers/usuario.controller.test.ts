import { Request, Response } from "express";
import { UsuarioController } from "../../src/controllers/UsuarioController";
import HttpError from "../../src/errors/HttpError";

const mockUsuarioService = {
  listarUsuarios: jest.fn(),
  listarUsuario: jest.fn(),
  excluirUsuario: jest.fn(),
};

describe("UsuarioController", () => {
  let usuarioController: UsuarioController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    jest.clearAllMocks();

    usuarioController = new UsuarioController(mockUsuarioService as any);

    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
  });

  describe("listarUsuarios", () => {
    it("deve retornar lista de usuários com paginação padrão", async () => {
      const mockUsuarios = {
        dados: [{ id: 1, nome: "Usuário 1" }],
        total: 1,
        pagina: 1,
        limite: 10,
      };
      mockUsuarioService.listarUsuarios.mockResolvedValue(mockUsuarios);

      await usuarioController.listarUsuarios(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUsuarioService.listarUsuarios).toHaveBeenCalledWith({
        pagina: 1,
        limite: 10,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        code: "SUCCESS",
        dados: mockUsuarios.dados,
        total: mockUsuarios.total,
        pagina: mockUsuarios.pagina,
        limite: mockUsuarios.limite,
      });
    });

    it("deve tratar erro do serviço corretamente", async () => {
      const error = new HttpError("Erro no servidor", 500);
      mockUsuarioService.listarUsuarios.mockRejectedValue(error);

      await usuarioController.listarUsuarios(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toEqual({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro no servidor",
      });
    });

    it("deve tratar erro genérico corretamente", async () => {
      mockUsuarioService.listarUsuarios.mockRejectedValue(
        new Error("Erro genérico")
      );

      await usuarioController.listarUsuarios(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toEqual({
        code: "INTERNAL_SERVER_ERROR",
        mensagem: "Erro interno ao buscar usuários. Tente mais tarde.",
      });
    });
  });

  describe("excluirUsuario", () => {
    it("deve excluir usuário com sucesso", async () => {
      const usuarioExcluido = { id: 1, nome: "Excluído" };
      mockRequest.params = { id: "1" };
      mockUsuarioService.listarUsuario.mockResolvedValue({
        id: 1,
        nome: "Existente",
      });
      mockUsuarioService.excluirUsuario.mockResolvedValue(usuarioExcluido);

      await usuarioController.excluirUsuario(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUsuarioService.excluirUsuario).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        code: "SUCCESS",
        mensagem: "Usuário excluído com sucesso.",
        dados: usuarioExcluido,
      });
    });

    it("deve retornar 404 quando usuário não existe", async () => {
      mockRequest.params = { id: "999" };
      mockUsuarioService.listarUsuario.mockResolvedValue(null);

      await usuarioController.excluirUsuario(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        code: "RESOURCE_NOT_FOUND",
        mensagem: "Usuário não encontrado para exclusão.",
      });
    });
  });
});
