import { Router } from "express";
import { categoriaRoutes } from "./modules/categoriaRoutes";
import { usuarioRoutes } from "./modules/usuarioRoutes";
import { receitaRoutes } from "./modules/receitaRoutes";

const router = Router();

router.use("/categorias", categoriaRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/receitas", receitaRoutes);

export default router;
