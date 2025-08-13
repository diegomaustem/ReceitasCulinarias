import { createRouter, createWebHistory } from "vue-router";
import ReceitasView from "../views/ReceitasView.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/login",
    redirect: { name: "login" },
  },
  {
    path: "/receitas",
    name: "receitas",
    component: ReceitasView,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuarios",
    name: "usuarios",
    component: () => import("../views/UsuarioView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const tokenAcesso = !!localStorage.getItem("tokenAcesso");

  if (to.meta.requiresAuth && !tokenAcesso) {
    return { name: "login" };
  }

  return true;
});

export default router;
