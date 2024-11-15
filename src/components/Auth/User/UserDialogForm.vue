<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="isVisible"
      close-icon="false"
      header="Ubah Pengguna"
      pt:root:class="!border-0 !bg-transparent"
      pt:mask:class="backdrop-blur-sm"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Perbarui informasi pengguna.
      </span>

      <!-- Progress Spinner -->
      <div v-if="isLoading" class="flex justify-center mb-4">
        <ProgressSpinner />
      </div>

      <div v-else>
        <div class="flex items-center gap-4 mb-8">
          <label for="email" class="font-semibold w-24">Alamat Email</label>
          <InputText
            id="email"
            class="flex-auto"
            v-model="localUser.email"
            autocomplete="off"
            disabled
          />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="name" class="font-semibold w-24">Nama Lengkap</label>
          <InputText id="name" class="flex-auto" v-model="localUser.name" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="role" class="font-semibold w-24">Peran</label>
          <Select
            v-model="selectedRole"
            :options="roles"
            @change="handleRoleChange"
            optionLabel="name"
            placeholder="select a role"
            class="flex-auto"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Batal" severity="secondary" @click="closeDialog"></Button>
          <Button
            type="button"
            label="Simpan"
            severity="info"
            @click="saveUser"
            :disabled="isSaveDisabled"
            :class="[isSaveDisabled ? 'cursor-not-allowed' : 'cursor-pointer']"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watchEffect, watch } from 'vue'
import { useRouter } from 'vue-router'
import { updateUserbyId } from '@/services/modules/UserService'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import ProgressSpinner from 'primevue/progressspinner'

// Define props
const props = defineProps({
  visible: Boolean,
  user: Object
})

// Define events that the component can emit
const emit = defineEmits(['update:visible', 'updateUser'])

// Create a local copy of the user prop
const localUser = ref({ ...props.user })
const isLoading = ref(false)

// Define role options
const roles = ref([{ name: 'admin' }, { name: 'technical_writer' }])
const selectedRole = ref(null)

watchEffect(() => {
  localUser.value = { ...props.user }
  selectedRole.value = roles.value.find((cat) => cat.name === props.user?.role) || null
})

// Computed property to check if the Save button should be disabled
const isSaveDisabled = computed(() => {
  return (
    localUser.value.username === props.user.username &&
    localUser.value.name === props.user.name &&
    localUser.value.role === props.user.role
  )
})

// Event to handle role change
const handleRoleChange = (selectedOption) => {
  localUser.value.role = selectedOption.value.name
}

// Create a local reactive variable for dialog visibility
const isVisible = ref(props.visible)

watch(
  () => props.visible,
  (newVisible) => {
    isVisible.value = newVisible
  }
)

const closeDialog = () => {
  emit('update:visible', false)
}

const router = useRouter()

const saveUser = async () => {
  try {
    isLoading.value = true

    // Assign the selectedRole back to localUser before saving
    localUser.value.role = selectedRole.value?.name

    // Build request for updating the user
    const request = {
      user_id: localUser.value.user_id,
      username: localUser.value.username,
      name: localUser.value.name,
      role: localUser.value.role
    }

    // Call the API to update the user
    const response = await updateUserbyId(localUser.value.user_id, request)
    if (response.status === 400) throw response

    closeDialog()
    router.go(0)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
