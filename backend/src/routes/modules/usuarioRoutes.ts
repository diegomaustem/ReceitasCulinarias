import { Router } from "express";
import { usuarioController } from "../../controllers/UsuarioController";

const router = Router();

router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.listarUsuario);
router.post("/", usuarioController.criarUsuario);
router.patch("/:id", usuarioController.atualizarUsuario);
router.delete("/:id", usuarioController.excluirUsuario);

export const usuarioRoutes = router;
