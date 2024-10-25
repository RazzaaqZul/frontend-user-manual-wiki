<template>
  <section
    class="fixed w-screen h-screen flex justify-center items-center bg-grey-word bg-opacity-20"
  >
    <div class="restore-dialog">
      <p class="warning-text">
        You are about to restore <strong>{{ item.title }}</strong> back to its original state.
        Please confirm if you want to proceed.
      </p>

      <div class="form-section">
        <div class="form-group">
          <input type="checkbox" v-model="isConfirmed" id="confirmRestore" />
          <label for="confirmRestore">
            I confirm that I want to restore this item and understand the consequences.
          </label>
        </div>

        <div class="button-group">
          <button @click="handleCancel" class="btn-cancel">Cancel</button>
          <button @click="handleRestore" class="btn-restore" :disabled="!isConfirmed">
            Restore
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: Object // Terima item yang akan direstore dari TrashMain.vue
})

const isConfirmed = ref(false)

const emit = defineEmits(['cancel', 'restore'])

const handleCancel = () => {
  emit('cancel')
}

const handleRestore = () => {
  emit('restore', props.item) // Emit event dengan data item yang dipilih
}
</script>

<style scoped>
.restore-dialog {
  max-width: 600px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-text {
  color: #333;
  margin-bottom: 20px;
  line-height: 1.5;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 8px 20px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-restore {
  padding: 8px 20px;
  background-color: #00c355;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-restore:disabled {
  background-color: #00ff735a;
  cursor: not-allowed;
}
</style>
