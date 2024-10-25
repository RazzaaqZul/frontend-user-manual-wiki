<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="isVisible"
      close-icon="false"
      header="Delete User"
      pt:root:class="!border-0 !bg-transparent"
      pt:mask:class="backdrop-blur-sm"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Are you sure you want to delete this user?
      </span>

      <!-- Progress Spinner -->
      <div v-if="isLoading" class="flex justify-center mb-4">
        <ProgressSpinner />
      </div>

      <div v-else>
        <div class="flex items-center gap-4 mb-4">
          <label for="username" class="font-semibold w-24">Username</label>
          <InputText id="username" class="flex-auto" v-model="localUser.username" disabled />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="email" class="font-semibold w-24">Email</label>
          <InputText id="email" class="flex-auto" v-model="localUser.email" disabled />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="name" class="font-semibold w-24">Name</label>
          <InputText id="name" class="flex-auto" v-model="localUser.name" disabled />
        </div>

        <!-- Confirmation Checkbox -->
        <div class="flex items-center gap-4 mb-8">
          <Checkbox v-model="isConfirmed" />
          <label class="text-sm">I am sure I want to delete this user</label>
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />
          <Button
            v-if="!isCurrentUser"
            type="button"
            label="Delete"
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
import Checkbox from 'primevue/checkbox'
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
