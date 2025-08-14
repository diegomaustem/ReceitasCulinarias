import { Router } from "express";
import { criarUsuarioController } from "../../composition/usuarios.composition";
import { validate } from "../../middlewares/middlewareValidacao";
import {
  schemaAtualizacaoUsuario,
  schemaCriacaoUsuario,
} from "../../validations/ValidacaoUsuario";

const router = Router();
const usuarioController = criarUsuarioController();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gestão de usuários do sistema
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: João Silva
 *                   email:
 *                     type: string
 *                     example: joao@exemplo.com
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtém um usuário específico
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 */

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
