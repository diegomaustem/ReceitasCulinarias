import rateLimit from "express-rate-limit";
export const limitadorRequisicao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "erro",
    mensagem: "Muitas requisições. Por favor, tente novamente mais tarde.",
  },
});
