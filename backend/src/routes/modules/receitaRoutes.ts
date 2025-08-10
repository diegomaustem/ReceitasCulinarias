import { Router } from "express";
import { criarReceitaController } from "../../composition/receita.composition";
import { validate } from "../../middlewares/middlewareValidacao";
import {
  schemaAtualizacaoReceita,
  schemaCriacaoReceita,
} from "../../validations/ValidacaoReceita";

const router = Router();
const receitaController = criarReceitaController();

router.get("/", receitaController.listarReceitas);
router.get("/:id", receitaController.listarReceita);
router.post(
  "/",
  validate(schemaCriacaoReceita, "body"),
  receitaController.criarReceita
);
router.patch(
  "/:id",
  validate(schemaAtualizacaoReceita, "body"),
  receitaController.atualizarReceita
);
router.delete("/:id", receitaController.excluirReceita);

export const receitaRoutes = router;
