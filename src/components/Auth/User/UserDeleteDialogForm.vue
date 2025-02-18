<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="isVisible"
      close-icon="false"
      header="Hapus Pengguna"
      pt:root:class="!border-0 !bg-transparent"
      pt:mask:class="backdrop-blur-sm"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Apakah Anda yakin ingin menghapus pengguna ini?
      </span>

      <!-- Progress Spinner -->
      <div v-if="isLoading" class="flex justify-center mb-4">
        <ProgressSpinner />
      </div>

      <div v-else>
        <div class="flex items-center gap-4 mb-4">
          <label for="email" class="font-semibold w-24">Alamat Email</label>
          <InputText id="email" class="flex-auto" v-model="localUser.email" disabled />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="name" class="font-semibold w-24">Name</label>
          <InputText id="name" class="flex-auto" v-model="localUser.name" disabled />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="name" class="font-semibold w-24">Peran</label>
          <InputText id="name" class="flex-auto" v-model="localUser.role" disabled />
        </div>

        <!-- Confirmation Checkbox -->
        <div class="flex items-center gap-4 mb-8">
          <input
            type="checkbox"
            id="confirmationCheckbox"
            v-model="isConfirmed"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 duration-300"
          />
          <label for="confirmationCheckbox" class="text-sm"
            >Saya yakin saya ingin menghapus pengguna ini</label
          >
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" label="Batal" severity="secondary" @click="closeDialog" />
          <Button
            v-if="!isCurrentUser"
            type="button"
            label="Hapus"
            severity="danger"
            :disabled="!isConfirmed"
            @click="deleteUser"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, watchEffect } from 'vue'
import { deleteUserById } from '@/services/modules/UserService' // Your delete user service
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import { useRouter } from 'vue-router'

// Define props
const props = defineProps({
  visible: Boolean,
  user: Object
})

const emit = defineEmits(['update:visible', 'userDeleted'])

const localUser = ref(props.user)
const isLoading = ref(false)
const isConfirmed = ref(false) // Checkbox state
const isVisible = ref(props.visible)
const router = useRouter()

watchEffect(() => {
  localUser.value = { ...props.user }
})

// Watch for visibility change
watch(
  () => props.visible,
  (newVisible) => {
    isVisible.value = newVisible
  }
)

const closeDialog = () => {
  emit('update:visible', false)
}

const deleteUser = async () => {
  try {
    isLoading.value = true

    // Delete user by ID
    const response = await deleteUserById(localUser.value.user_id)
    if (response.status == 400) {
      throw response
    }
    console.log('User deleted successfully:', response)

    // Emit event to notify parent
    emit('userDeleted', localUser.value)

    closeDialog()
    router.go(0)
  } catch (error) {
    console.error('Error while deleting user:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
