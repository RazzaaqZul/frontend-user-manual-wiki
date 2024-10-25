<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="isVisible"
      close-icon="false"
      header="Edit User"
      pt:root:class="!border-0 !bg-transparent"
      pt:mask:class="backdrop-blur-sm"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Update your information.</span
      >

      <!-- Progress Spinner -->
      <div v-if="isLoading" class="flex justify-center mb-4">
        <ProgressSpinner />
      </div>

      <div v-else>
        <div class="flex items-center gap-4 mb-4">
          <label for="username" class="font-semibold w-24">Username</label>
          <InputText
            id="username"
            class="flex-auto"
            v-model="localUser.username"
            autocomplete="off"
          />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="email" class="font-semibold w-24">Email</label>
          <InputText
            id="email"
            class="flex-auto"
            v-model="localUser.email"
            autocomplete="off"
            disabled=""
          />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="name" class="font-semibold w-24">Name</label>
          <InputText id="name" class="flex-auto" v-model="localUser.name" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="role" class="font-semibold w-24">Role</label>
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
          <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
          <Button type="button" label="Save" severity="info" @click="saveUser"></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { updateUserbyId } from '@/services/modules/UserService'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import ProgressSpinner from 'primevue/progressspinner'
import { ref, defineProps, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// Define props
const props = defineProps({
  visible: Boolean,
  user: Object
})

// Define events that the component can emit
const emit = defineEmits(['update:visible', 'updateUser'])

// Create a local copy of the user prop
const localUser = ref(props.user) // Spread the user object to create a new object
const isLoading = ref(false) // State for showing the loading spinner

watchEffect(() => {
  localUser.value = { ...props.user }
})

// Define role options
const roles = ref([{ name: 'admin' }, { name: 'technical_writer' }])
const selectedRole = ref('') // Inisialisasi langsung dengan role dari localUser

watchEffect(() => {
  const roleValue = localUser.value.role
  if (roleValue) {
    const matchedRole = roles.value.find((cat) => cat.name === roleValue)
    selectedRole.value = matchedRole ? matchedRole : null
  }
})

// Watch for changes to the user prop
watch(
  () => props.user,
  (newUser) => {
    localUser.value = { ...newUser } // Update localUser when props.user changes
  }
)

watch(
  () => localUser.value.user,
  (newUser) => {
    localUser.value = { ...newUser } // Update localUser when props.user changes
    console.log(localUser)
  }
)

const handleRoleChange = (selectedOption) => {
  localUser.value.role = selectedOption.value.name // Directly use the name property
}

// Create a local reactive variable for dialog visibility
const isVisible = ref(props.visible)

// Watch for changes to the visible prop
watch(
  () => props.visible,
  (newVisible) => {
    isVisible.value = newVisible // Update local visibility state when prop changes
  }
)

const closeDialog = () => {
  emit('update:visible', false) // Emit an event to update the parent about dialog closure
}

const router = useRouter()

const saveUser = async () => {
  try {
    isLoading.value = true // Set loading to true when request starts

    // Assign the selectedRole back to localUser before saving
    localUser.value.role = selectedRole.value?.name

    // Buat request update berdasarkan user yang sedang di-edit
    const request = {
      user_id: localUser.value.user_id,
      username: localUser.value.username,
      name: localUser.value.name,
      role: localUser.value.role
    }

    // Panggil API untuk melakukan update
    const response = await updateUserbyId(localUser.value.user_id, request)
    if (response.status == 400) {
      throw response
    }
    console.log('User berhasil diupdate:', response)

    closeDialog()
    router.go(0)
  } catch (error) {
    console.error('Error saat mengupdate user:', error)
  } finally {
    isLoading.value = false // Set loading to false when request finishes
  }
}
</script>
