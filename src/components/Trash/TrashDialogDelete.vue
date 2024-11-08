<template>
  <section
    class="fixed w-screen h-screen flex justify-center items-center bg-grey-word bg-opacity-20"
  >
    <div class="delete-dialog">
      <p class="warning-text">
        You are about to delete <strong>{{ item.title }}</strong> along with all of its history.
        Please confirm that you intend to do this, that you understand the consequences, and that
        you are doing this in accordance with
        <span class="policy-link" @click="openPolicy">the policy</span>.
      </p>

      <div class="form-section">
        <!-- Checkbox confirmation -->
        <div class="form-group">
          <input type="checkbox" v-model="isConfirmed" id="confirmDelete" />
          <label for="confirmDelete">
            I confirm that I want to delete this item and understand the consequences.
          </label>
        </div>

        <div class="button-group">
          <button @click="handleCancel" class="btn-cancel">Cancel</button>
          <button @click="handleDelete" class="btn-delete" :disabled="!isConfirmed">Delete</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: Object // Terima item yang akan dihapus dari TrashMain.vue
})

const isConfirmed = ref(false)

const emit = defineEmits(['cancel', 'delete', 'openPolicy'])

const handleCancel = () => {
  emit('cancel')
}

const handleDelete = () => {
  emit('delete', props.item) // Emit event dengan data item yang dipilih
}

const openPolicy = () => {
  emit('openPolicy')
}
</script>

<style scoped>
.delete-dialog {
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

.btn-delete {
  padding: 8px 20px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:disabled {
  background-color: #ffcccc;
  cursor: not-allowed;
}
</style>
