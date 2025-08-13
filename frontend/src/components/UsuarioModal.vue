<template>
  <div v-if="modelValue" class="modal fade show d-block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalhes do Usuário</h5>
          <button
            @click="$emit('update:modelValue', false)"
            class="btn-close"
          ></button>
        </div>
        <div v-if="usuario" class="modal-body">
          <p><strong>Usuário:</strong> {{ usuario.nome }}</p>
          <p><strong>Login:</strong> {{ usuario.login }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import type { Usuario } from "../types/Usuario";

defineProps<{
  modelValue: boolean;
  usuario: Usuario | null;
}>();

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.modal-title {
  font-weight: 600;
}
</style>
