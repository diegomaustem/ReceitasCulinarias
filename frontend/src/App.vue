<template>
  <div class="container-fluid px-0">
    <header
      v-if="$route.name !== 'login'"
      class="bg-white py-3 border-bottom shadow-sm"
    >
      <div class="container d-flex align-items-center">
        <router-link
          to="/receitas"
          class="navbar-brand me-4 d-none d-md-block text-decoration-none"
          active-class=""
          exact-active-class=""
        >
          <h1 class="fw-bold title-app m-0">ReceitasApp</h1>
        </router-link>
        <nav class="nav flex-grow-1">
          <router-link
            to="/receitas"
            class="nav-link px-3 py-2 mx-1 fw-medium position-relative"
            active-class="active"
          >
            <i class="bi bi-journal-text me-1"></i>
            Receitas
            <span class="nav-link-hover"></span>
          </router-link>

          <router-link
            to="/usuarios"
            class="nav-link px-3 py-2 mx-1 fw-medium position-relative"
            active-class="active"
          >
            <i class="bi bi-people me-1"></i>
            Usuários
            <span class="nav-link-hover"></span>
          </router-link>
        </nav>
        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2 text-secondary"></i>
            <span class="text-truncate" style="max-width: 150px">
              {{ authStore.nomeUsuario }}
            </span>
          </div>
          <button
            class="btn btn-logout btn-sm py-1"
            @click="fazerLogout"
            title="Sair"
          >
            <i class="bi bi-box-arrow-right"></i>
            <span class="d-none d-sm-inline ms-1">Sair</span>
          </button>
        </div>
      </div>
    </header>

    <main class="container py-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth.store";

const authStore = useAuthStore();
const router = useRouter();

const fazerLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<style scoped>
.me-2 {
  font-weight: 500;
}
.title-app {
  color: #212529;
  font-size: 35px;
}

.nav-link {
  color: #495057;
  font-size: 18px;
  transition: all 0.3s ease;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.1);
}

.nav-link-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #0d6efd;
  transition: width 0.3s ease;
}

.nav-link:hover .nav-link-hover {
  width: 100%;
}

.nav-link.active {
  color: #0d6efd;
  font-weight: 600;
}

.nav-link.active .nav-link-hover {
  width: 100%;
}

/* Estado exato ativo (quando a rota é exatamente a do link) */
.nav-link.router-link-exact-active {
  background-color: rgba(13, 110, 253, 0.05);
}

.btn-logout {
  background-color: #3b82f6;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-logout:hover {
  filter: brightness(0.9);
}
</style>
