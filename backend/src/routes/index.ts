import { Router } from "express";
import { categoriaRoutes } from "./modules/categoriaRoutes";
import { usuarioRoutes } from "./modules/usuarioRoutes";
import { receitaRoutes } from "./modules/receitaRoutes";
import { autenticacaoRoutes } from "./modules/autenticacaoRoutes";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/receitas", receitaRoutes);
router.use("/login", autenticacaoRoutes);

export default router;
