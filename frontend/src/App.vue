<template>
  <div class="container-fluid">
    <header
      v-if="$route.name !== 'login'"
      class="bg-light py-3 border-bottom d-flex align-items-center justify-content-between"
    >
      <div class="user-info d-flex align-items-center me-3"></div>
      <nav class="nav flex-grow-1 justify-content-center">
        <router-link to="/receitas" class="nav-link">Receitas</router-link>
        <router-link to="/usuarios" class="nav-link">Usuários</router-link>
      </nav>

      <div class="user-info d-flex align-items-center me-3">
        <span class="me-2">
          {{ authStore.nomeUsuario }}
        </span>
        <button class="btn btn-md btn-logout" @click="fazerLogout">Sair</button>
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
.nav-link {
  font-size: 20px;
  color: #0c1114;
}
.router-link-active {
  font-weight: bold;
  color: #252a2e !important;
  border-bottom: 2px solid #252a2e;
}
.me-2 {
  font-weight: 500;
}
</style>
