import { Router } from "express";
import { criarCategoriaController } from "../../composition/categoria.composition";

const router = Router();
const categoriaController = criarCategoriaController();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints para gestão de categorias
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Listagem de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439011
 *                   nome:
 *                     type: string
 *                     example: Sobremesas
 *                   descricao:
 *                     type: string
 *                     example: Receitas doces e deliciosas
 */

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtém uma categoria específica
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6
 *     responses:
 *       200:
 *         description: Detalhes da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *       404:
 *         description: Categoria não encontrada
 */
router.get("/", categoriaController.listarCategorias);
router.get("/:id", categoriaController.listarCategoria);

export const categoriaRoutes = router;
