import { Router } from "express";
import { criarReceitaController } from "../../composition/receita.composition";
import { validate } from "../../middlewares/middlewareValidacao";
import {
  schemaAtualizacaoReceita,
  schemaCriacaoReceita,
} from "../../validations/ValidacaoReceita";

const router = Router();
const receitaController = criarReceitaController();

/**
 * @swagger
 * tags:
 *   name: Receitas
 *   description: Operações com receitas culinárias
 */

/**
 * @swagger
 * /receitas:
 *   get:
 *     summary: Lista todas as receitas
 *     tags: [Receitas]
 *     responses:
 *       200:
 *         description: Lista de receitas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 3
 *                   titulo:
 *                     type: string
 *                     example: Bolo de Chocolate
 */

/**
 * @swagger
 * /receitas/{id}:
 *   get:
 *     summary: Obtém detalhes de uma receita
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes da receita
 *       404:
 *         description: Receita não encontrada
 */

/**
 * @swagger
 * /receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags: [Receitas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Receita criada com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /receitas/{id}:
 *   patch:
 *     summary: Atualiza uma receita
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receita atualizada
 *       404:
 *         description: Receita não encontrada
 */

/**
 * @swagger
 * /receitas/{id}:
 *   delete:
 *     summary: Remove uma receita
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Receita removida
 *       404:
 *         description: Receita não encontrada
 */

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
