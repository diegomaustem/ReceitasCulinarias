import { Router } from "express";
import { categoriaController } from "../../controllers/CategoriaController";

const router = Router();

router.get("/", categoriaController.listarCategorias);
router.get("/:id", categoriaController.listarCategoria);

export const categoriaRoutes = router;
