import { Router } from "express";
import { criarReceitaController } from "../../composition/receita.composition";

const router = Router();
const receitaController = criarReceitaController();

router.get("/", receitaController.listarReceitas);
router.get("/:id", receitaController.listarReceita);
router.post("/", receitaController.criarReceita);
router.patch("/:id", receitaController.atualizarReceita);
router.delete("/:id", receitaController.excluirReceita);

export const receitaRoutes = router;
