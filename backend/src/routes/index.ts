import { Router } from "express";
import { categoriaRoutes } from "./modules/categoriaRoutes";
import { usuarioRoutes } from "./modules/usuarioRoutes";
import { receitaRoutes } from "./modules/receitaRoutes";
import { autenticacaoRoutes } from "./modules/autenticacaoRoutes";
import { auth } from "../middlewares/middlewareAutenticacao";
import { limitadorRequisicao } from "../middlewares/limitadorRequisicao";

const router = Router();

router.use("/usuarios", auth, usuarioRoutes);
router.use("/categorias", auth, categoriaRoutes);
router.use("/receitas", auth, receitaRoutes);
router.use("/login", limitadorRequisicao, autenticacaoRoutes);

export default router;
