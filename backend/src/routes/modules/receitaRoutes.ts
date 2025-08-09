import { Router } from "express";
import { receitaController } from "../../controllers/ReceitaController";

const router = Router();

router.get("/", receitaController.listarReceitas);
router.get("/:id", receitaController.listarReceita);
router.post("/", receitaController.criarReceita);
router.patch("/:id", receitaController.atualizarReceita);
router.delete("/:id", receitaController.excluirReceita);

export const receitaRoutes = router;
