import { Router } from "express";
import { criarAuthController } from "../../composition/auth.composition";
import { validate } from "../../middlewares/middlewareValidacao";
import { schemaLoginUsuario } from "../../validations/ValidationLogin";

const router = Router();
const authController = criarAuthController();

router.post("/", validate(schemaLoginUsuario, "body"), authController.login);

export const autenticacaoRoutes = router;
