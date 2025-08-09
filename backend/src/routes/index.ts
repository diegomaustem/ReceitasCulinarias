import { Router } from "express";
import { categoriaRoutes } from "./modules/categoriaRoutes";

const router = Router();

router.use("/categorias", categoriaRoutes);

export default router;
