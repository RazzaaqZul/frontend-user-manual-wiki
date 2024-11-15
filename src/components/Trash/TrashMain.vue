<template>
  <div>
    <!-- Delete Confirmation Dialog for selected item -->
    <TrashDialogDelete
      v-if="showDeleteDialog"
      :item="itemToDelete"
      @cancel="closeDeleteDialog"
      @delete="handleDelete"
    />

    <!-- Restore Confirmation Dialog for selected item -->
    <TrashDialogRestore
      v-if="showRestoreDialog"
      :item="itemToRestore"
      @cancel="closeRestoreDialog"
      @restore="handleRestore"
    />

    <div class="px-[15%] py-4">
      <h2 class="text-2xl font-bold text-soft-blue border-b-4 border-grey-input py-5 mb-5">
        Sampah
      </h2>

      <!-- Show spinner while fetching data -->
      <section v-if="isFetching" class="w-full flex justify-center items-center h-[60vh]">
        <ProgressSpinner />
      </section>

      <!-- Show message if no data after fetching -->
      <section
        v-else-if="!userManualTrash.length"
        class="w-full flex justify-center items-center h-[60vh]"
      >
        <p class="text-gray-500">No trash items available.</p>
      </section>

      <!-- Show table if there is data -->
      <section v-else class="border-grey-button border-2 p-7 rounded-xl">
        <table class="min-w-full table-auto">
          <tbody>
            <tr v-for="trash in sortedUserManual" :key="trash.user_manual_id">
              <td :class="itemStyle()">
                <img src="../../assets/icon/icon-file.png" class="w-8" alt="logo-file" />
              </td>
              <td :class="itemStyle()">{{ trash.title }}</td>
              <td :class="itemStyle()">{{ trash.version }}</td>
              <td :class="itemStyle()">{{ formatDateTime(trash.deleted_at) }}</td>
              <td :class="itemStyle()">{{ trash.initial_editor }}</td>
              <td :class="itemStyle()">{{ trash.size }}</td>
              <td :class="itemStyle()">
                <img
                  src="../../assets/icon/icon-restore.png"
                  alt="restore"
                  class="w-6 cursor-pointer hover:scale-110"
                  @click="openRestoreDialog(trash)"
                />
              </td>
              <td :class="itemStyle()">
                <img
                  src="../../assets/icon/icon-delete.png"
                  alt="delete"
                  class="w-6 cursor-pointer hover:scale-110"
                  @click="openDeleteDialog(trash)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { formatDateTime } from '@/helpers/FormatDate'
import { computed, ref, watch } from 'vue'
import TrashDialogDelete from './TrashDialogDelete.vue'
import TrashDialogRestore from './TrashDialogRestore.vue'
import { deletePermanent, restoreUserManual } from '@/services/modules/TrashUserManualService'
import { useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  userManualTrash: Array // userManualTrash diharapkan berupa Array
})

// Dialog state
const showDeleteDialog = ref(false)
const showRestoreDialog = ref(false)
const itemToDelete = ref(null) // Objek item yang dipilih untuk dihapus
const itemToRestore = ref(null) // Objek item yang dipilih untuk direstore
const isFetching = ref(true) // State for loading

// Open Delete Dialog
const openDeleteDialog = (item) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

// Open Restore Dialog
const openRestoreDialog = (item) => {
  itemToRestore.value = item
  showRestoreDialog.value = true
}

// Close dialogs
const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  itemToDelete.value = null
}

const closeRestoreDialog = () => {
  showRestoreDialog.value = false
  itemToRestore.value = null
}

const router = useRouter()
// Handle Delete
const handleDelete = async () => {
  const response = await deletePermanent(itemToDelete.value.user_manual_id)
  console.log(response)
  console.log('Deleting item:', itemToDelete.value)
  closeDeleteDialog()
  router.go(0) // Refresh UI after delete
}

// Handle Restore
const handleRestore = async () => {
  const response = await restoreUserManual(itemToRestore.value.user_manual_id)
  console.log(response)
  console.log('Restoring item:', itemToRestore.value)
  closeRestoreDialog()
  router.go(0) // Refresh UI after restore
}

// Sort user manuals
const sortedUserManual = computed(() => {
  return [...props.userManualTrash].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
})

// Item style
const itemStyle = () => {
  return 'px-4 py-7 border-b-2 border-grey-background'
}

// Watch for fetching data
watch(
  () => props.userManualTrash,
  () => {
    isFetching.value = false // Set fetching to false once data is received
  }
)
</script>
