import { Router } from "express";
import { criarAuthController } from "../../composition/auth.composition";
import { validate } from "../../middlewares/middlewareValidacao";
import { schemaLoginUsuario } from "../../validations/ValidationLogin";

const router = Router();
const authController = criarAuthController();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoint para login e obtenção de token JWT
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login e retorna token de acesso
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: Erick@mattos
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: 123456789
 *     responses:
 *       200:
 *         description: Token de acesso gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/", validate(schemaLoginUsuario, "body"), authController.login);

export const autenticacaoRoutes = router;
