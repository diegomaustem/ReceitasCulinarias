import { Router } from "express";
import { criarCategoriaController } from "../../composition/categoria.composition";

const router = Router();
const categoriaController = criarCategoriaController();

router.get("/", categoriaController.listarCategorias);
router.get("/:id", categoriaController.listarCategoria);

export const categoriaRoutes = router;
