import { Router } from "express";
import { criarUsuarioController } from "../../composition/usuarios.composition";
import { validate } from "../../middlewares/middlewareValidacao";
import {
  schemaAtualizacaoUsuario,
  schemaCriacaoUsuario,
} from "../../validations/ValidacaoUsuario";

const router = Router();
const usuarioController = criarUsuarioController();

router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.listarUsuario);
router.post(
  "/",
  validate(schemaCriacaoUsuario, "body"),
  usuarioController.criarUsuario
);
router.patch(
  "/:id",
  validate(schemaAtualizacaoUsuario, "body"),
  usuarioController.atualizarUsuario
);
router.delete("/:id", usuarioController.excluirUsuario);

export const usuarioRoutes = router;
