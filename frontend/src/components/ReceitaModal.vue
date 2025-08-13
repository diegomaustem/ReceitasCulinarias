<template>
  <div v-if="modelValue" class="modal fade show d-block">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ receita?.nome }}</h5>
          <button
            @click="$emit('update:modelValue', false)"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <h6>Ingredientes</h6>
              <pre class="p-3 bg-light rounded">{{
                receita?.ingredientes
              }}</pre>
            </div>
            <div class="col-md-6">
              <h6>Modo de Preparo</h6>
              <pre class="p-3 bg-light rounded">{{ receita?.modoPreparo }}</pre>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h6>Tempo de Preparo</h6>
              <span class="badge bg-primary">
                <i class="bi bi-clock"></i>
                {{ receita?.tempoPreparoMinutos }} minutos
              </span>
            </div>
            <div class="col-md-6">
              <h6>Porções</h6>
              <span class="badge bg-dark">
                <i class="bi bi-clock"></i>
                {{ receita?.porcoes }} Unidade(s)
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('update:modelValue', false)"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import type { Receita } from "../types/Receita";

defineProps<{
  modelValue: boolean;
  receita?: Receita | null;
}>();

defineEmits(["update:modelValue"]);
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  font-family: inherit;
}
</style>
