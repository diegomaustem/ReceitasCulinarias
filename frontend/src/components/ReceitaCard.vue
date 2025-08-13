<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ receita.nome }}</h5>
      <p class="card-text text-muted">
        <small>
          <i class="bi bi-clock"></i> Tempo preparo:
          {{ receita.tempoPreparoMinutos }} minutos
        </small>
      </p>
      <div class="btn-group w-100">
        <button
          @click="$emit('visualizar')"
          class="btn btn-sm btn-outline-primary"
        >
          <Eye :size="22" />
        </button>
        <button
          @click="$emit('editar')"
          class="btn btn-sm btn-outline-secondary"
        >
          <SquarePen :size="22" />
        </button>
        <button @click="$emit('excluir')" class="btn btn-sm btn-outline-danger">
          <Trash2 :size="22" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Receita } from "../types/Receita";
import { Eye, SquarePen, Trash2 } from "lucide-vue-next";

defineProps<{
  receita: Receita;
}>();

defineEmits(["visualizar", "editar", "excluir"]);
</script>

<style scoped>
.card {
  border-radius: 8px;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}

.card-title {
  font-weight: 500;
}
</style>
