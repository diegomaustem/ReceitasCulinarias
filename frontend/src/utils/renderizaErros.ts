import { isAxiosError } from "axios";

export function renderizarErros(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      const erroApi = error.response.data;
      if (erroApi && typeof erroApi === "object" && "mensagem" in erroApi) {
        return String(erroApi.mensagem);
      }
      return "Um erro desconhecido ocorreu na comunicação.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Falha na conexão. Verifique sua conexão de internet.";
    }

    return error.message || "Erro desconhecido ao fazer requisição.";
  }

  if (error instanceof Error) {
    return error.message || "Ocorreu um erro inesperado. Tente novamente.";
  }

  return "Ocorreu um erro desconhecido.";
}
