<template>
  <section
    class="fixed w-screen h-screen flex justify-center items-center bg-grey-word bg-opacity-20"
  >
    <div class="delete-dialog" v-if="!showSuccessPopup && !showErrorPopup">
      <p class="warning-text">
        You are about to delete a page along with all of its history. Please confirm that you intend
        to do this, that you understand the consequences, and that you are doing this in accordance
        with
        <span class="policy-link" @click="openPolicy">the policy</span>.
      </p>

      <div class="form-section">
        <h2>Delete</h2>

        <div class="form-group">
          <label>Reason:</label>
          <select v-model="selectedReason" class="reason-select">
            <option value="">Select a reason</option>
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate content</option>
            <option value="duplicate">Duplicate content</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        <div v-if="selectedReason === 'other'" class="form-group">
          <label>Other additional reason:</label>
          <textarea
            v-model="additionalReason"
            class="additional-reason"
            rows="4"
            placeholder="Please specify your reason..."
          ></textarea>
        </div>

        <div class="button-group">
          <button @click="handleCancel" class="btn-cancel">Cancel</button>
          <button @click="handleDelete" class="btn-delete" :disabled="!isValidForm">Delete</button>
        </div>
      </div>
    </div>
    <PopUpSuccessful
      v-if="showSuccessPopup"
      title="Keren!"
      message="Kamu berhasil menghapus panduan ini."
      class="popup-center animate__animated animate__zoomIn"
    />

    <PopUpUnsuccessfull
      v-if="showErrorPopup"
      title="Error!"
      message="Gagal menghapus panduan ini!"
      class="popup-center animate__animated animate__zoomIn"
    />
  </section>
</template>

<script setup>
import router from '@/router'
import { destroyUserManual } from '@/services/modules/UserManualService'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PopUpSuccessful from '../widgets/PopUpSuccessful.vue'
import PopUpUnsuccessfull from '../widgets/PopUpUnsuccessfull.vue'

const selectedReason = ref('')
const additionalReason = ref('')
const route = useRoute()
const isValidForm = computed(() => {
  if (selectedReason.value === 'other') {
    return additionalReason.value.trim().length > 0
  }
  return selectedReason.value !== ''
})

const emit = defineEmits(['cancel', 'delete', 'openPolicy'])

const handleCancel = () => {
  emit('cancel')
}

const showErrorPopup = ref(false)
const errorMessage = ref({})
const showSuccessPopup = ref(false)

const handleDelete = async () => {
  try {
    const response = await destroyUserManual(route.params.id)
    console.log(response)
    if (response.status === 404) {
      // Handle error response
      console.error('Error:', response.data.errors)
      showErrorPopup.value = true
      return setTimeout(() => {
        showErrorPopup.value = false
      }, 3000)
    } else if (response.status === 200) {
      console.log(response)
      errorMessage.value = [] // Clear error message if no error
      showSuccessPopup.value = true
      setTimeout(() => {
        console.log('Push to main')
        showSuccessPopup.value = false
        return router.push('/main')
      }, 3000)
    }

    // Setelah operasi berhasil, lakukan navigasi
  } catch (error) {
    console.error('Failed to delete:', error)
  }
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
  position: absolute;
}

.warning-text {
  color: #333;
  margin-bottom: 20px;
  line-height: 1.5;
}

.policy-link {
  color: #ff0000;
  cursor: pointer;
  text-decoration: underline;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reason-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.additional-reason {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
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

button:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
