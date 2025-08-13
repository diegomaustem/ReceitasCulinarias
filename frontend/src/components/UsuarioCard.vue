<template>
  <div
    class="card mb-3"
    @click="$emit('visualizar', usuario.id)"
    style="cursor: pointer"
  >
    <div class="card-body d-flex align-items-center">
      <div class="user-icon me-3">
        <CircleUserRound :size="35" />
      </div>

      <div class="user-info flex-grow-1">
        <h5 class="mb-0">{{ usuario.nome }}</h5>
        <p class="text-muted mb-0">{{ usuario.login }}</p>
      </div>

      <div class="user-actions">
        <button
          @click.stop="$emit('editar', usuario.id)"
          class="btn btn-sm btn-dark me-2"
        >
          <SquarePen />
        </button>

        <button
          @click.stop="$emit('excluir', usuario.id)"
          class="btn btn-sm btn-dark"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { Trash2 } from "lucide-vue-next";
import { SquarePen } from "lucide-vue-next";
import { CircleUserRound } from "lucide-vue-next";
const props = defineProps({
  usuario: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["visualizar", "editar", "excluir"]);
</script>

<style scoped>
.user-icon {
  color: #ababae;
}
.user-info p,
.user-info small {
  margin-bottom: 0;
}

.btn-dark {
  background-color: #24292f;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-dark:hover {
  filter: brightness(0.9);
}

.btn-default {
  background-color: #f59c00;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-default:hover {
  filter: brightness(0.9);
}
</style>
