<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers, maxLength } from "@vuelidate/validators";
import { useAuthStore } from "../stores/auth.store";
import type { CredenciaisLogin } from "../types/CredenciaisLogin";
import { renderizarErros } from "../utils/renderizaErros";

const router = useRouter();
const authStore = useAuthStore();
const form = reactive<CredenciaisLogin>({
  login: "",
  senha: "",
});

const mensagemErro = ref<string | null>(null);
const lembrarMe = ref(false);

const rules = {
  form: {
    login: {
      required: helpers.withMessage("O login é obrigatório.", required),
      isAlphanumeric: helpers.withMessage(
        "O login não pode ser número.",
        helpers.regex(/^(?=.*[a-zA-Z])[a-zA-ZÀ-ÿ\s0-9@.#*:/]+$/)
      ),
      minLength: helpers.withMessage(
        "Pelo menos 3 caracteres na senha.",
        minLength(3)
      ),
      maxLength: helpers.withMessage(
        "Login no máximo 100 caracteres.",
        maxLength(100)
      ),
    },
    senha: {
      required: helpers.withMessage("A senha é obrigatória.", required),
      minLength: helpers.withMessage(
        "Pelo menos 6 caracteres na senha.",
        minLength(6)
      ),
      maxLength: helpers.withMessage(
        "A senha deve ter no máximo 20 caracteres.",
        maxLength(20)
      ),
    },
  },
};
const v$ = useVuelidate(rules, { form });

const fazerLogin = async () => {
  mensagemErro.value = null;
  const loginValido = await v$.value.$validate();
  if (!loginValido) {
    mostrarErro("Por favor, corrija os erros em seu login.");
    return;
  }

  try {
    const loginRealizado = await authStore.fazerLogin({
      login: form.login,
      senha: form.senha,
    });

    if (loginRealizado) {
      router.push({ name: "receitas" });
    }
  } catch (error) {
    console.log(error);
    mensagemErro.value = renderizarErros(error);
    mostrarErro(mensagemErro.value);
  }
};

const mostrarErro = (erro: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: erro,
  });
};
</script>
<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="d-flex flex-column border rounded shadow p-3">
      <form class="form-login" @submit.prevent="fazerLogin">
        <h2 class="text-center"><i class="fa-solid fa-user"></i> RECEITAS</h2>
        <div class="form-group form-text text-muted">
          <label class="d-flex" for="login">Login</label>
          <input
            v-model="form.login"
            autocomplete="login"
            type="login"
            class="form-control"
            id="login"
            required
            placeholder="receita@receitas.com"
            @blur="v$.form.login.$touch()"
          />
          <div
            v-if="v$.form.login.$error"
            class="text-danger-default text-start pt-1"
          >
            * {{ v$.form.login.$errors[0]?.$message }}
          </div>
        </div>
        <div class="form-group form-text text-muted">
          <label for="senha" class="d-flex">Senha</label>
          <input
            v-model="form.senha"
            type="password"
            id="senha"
            autocomplete="current-password"
            class="form-control"
            required
            placeholder="*********"
            @blur="v$.form.senha.$touch()"
          />
          <div
            v-if="v$.form.senha.$error"
            class="text-danger-default text-start pt-1"
          >
            * {{ v$.form.senha.$errors[0]?.$message }}
          </div>
        </div>
        <div class="form-group form-check form-text text-muted">
          <input type="checkbox" class="form-check-input" id="lembrarMe" />
          <label class="form-check-label" for="lembrarMe">Lembrar-me</label>
        </div>
        <div class="d-flex justify-content-center mt-3">
          <button
            type="submit"
            class="btn-login w-100"
            :disabled="authStore.carregando"
          >
            {{ authStore.carregando ? "Entrando..." : "Entrar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-login {
  max-width: 370px;
  width: 100%;
  margin: auto;
}
h2 {
  color: #24282f;
  font-weight: bold;
}

.btn-login {
  display: inline-block;
  background-color: #f59c00;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 0.6em 1.2em;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  filter: brightness(0.9);
}
</style>
