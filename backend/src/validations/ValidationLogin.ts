import Joi from "joi";

export const schemaLoginUsuario = Joi.object({
  login: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "O login deve ser um texto.",
    "string.empty": "O login não pode estar vazio.",
    "string.min": "O login deve ter pelo menos {#limit} caracteres.",
    "string.max": "O login deve ter no máximo {#limit} caracteres.",
    "any.required": "O login é obrigatório.",
  }),

  senha: Joi.string().trim().min(6).max(60).required().messages({
    "string.base": "A senha deve ser um texto.",
    "string.empty": "A senha não pode estar vazia.",
    "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
    "string.max": "A senha deve ter no máximo {#limit} caracteres.",
    "any.required": "A senha é obrigatória.",
  }),
});
