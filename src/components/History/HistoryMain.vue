<template>
  <div>
    <!-- Delete Confirmation Dialog for currentDataUserManual -->
    <UserManualDelete
      v-if="showDeleteDialog"
      @cancel="closeDeleteDialog"
      @openPolicy="handleOpenPolicy"
    />

    <!-- Delete Confirmation Dialog for History -->
    <HistoryDelete
      v-if="showHistoryDeleteDialog"
      :user_manual_history_id="itemToDeleteHistory?.user_manual_history_id"
      @cancel="closeHistoryDeleteDialog"
    />

    <!-- button back to main page -->
    <div class="absolute left-[5%] top-[8%] flex justify-center items-center gap-4">
      <RouterLink :to="`/main/user-manuals/${currentDataUserManual?.user_manual_id}`">
        <div
          class="bg-soft-blue rounded-full w-14 h-14 flex justify-center items-center hover:scale-105 duration-300 hover:shadow-2xl hover:shadow-dark-blue"
        >
          <img src="../../assets/icon/icon-back-white.png" class="w-7" />
        </div>
      </RouterLink>
    </div>

    <!-- Content -->
    <div class="px-[15%] py-4">
      <NavbarComponent />
      <h2 class="text-2xl font-bold text-soft-blue border-b-4 border-grey-input py-5 mb-5">
        History
      </h2>

      <!-- Tampilkan tabel dengan currentDataUserManual sebagai baris pertama -->
      <section
        v-if="currentDataUserManual || dataUserManualHistory"
        class="border-grey-button border-2 p-7 rounded-xl"
      >
        <div
          class="text-soft-blue text-lg font-semibold border-b-4 border-grey-background rounded py-5"
        >
          {{ currentDataUserManual?.title }} Revision History
        </div>
        <table class="min-w-full table-auto">
          <tbody>
            <!-- Baris untuk currentDataUserManual -->
            <tr v-if="currentDataUserManual">
              <td :class="[itemStyle()]">
                <img src="../../assets/icon/icon-file.png" class="w-8" alt="logo-file" />
              </td>
              <td :class="[itemStyle()]">
                {{ currentDataUserManual.title }}
              </td>
              <td :class="[itemStyle()]">
                {{ currentDataUserManual.version }}
              </td>
              <td :class="[itemStyle()]">
                {{ formatDateTime(currentDataUserManual.updated_at) }}
              </td>
              <td :class="[itemStyle()]">
                {{
                  dataUserManualHistory.length !== 0
                    ? 'Edited By ' + currentDataUserManual.latest_editor
                    : 'Created By ' + currentDataUserManual.initial_editor
                }}
              </td>
              <td :class="[itemStyle()]">
                {{ currentDataUserManual.size }}
              </td>
              <td :class="[itemStyle(), 'text-soft-blue italic']">Latest Version</td>
              <td :class="[itemStyle()]">
                <img
                  src="../../assets/icon/icon-delete.png"
                  alt="delete"
                  class="w-6 cursor-pointer hover:scale-110"
                  @click="openDeleteDialog(currentDataUserManual)"
                />
              </td>
            </tr>

            <!-- Baris untuk sortedHistory -->
            <tr v-for="history in sortedHistory" :key="history.user_manual_history_id">
              <td :class="[itemStyle()]">
                <RouterLink
                  :to="`/main/user-manuals/${history.user_manual_id}/histories/${history.user_manual_history_id}/detail`"
                >
                  <img src="../../assets/icon/icon-file.png" class="w-8" alt="logo-file" />
                </RouterLink>
              </td>
              <td :class="[itemStyle()]">{{ history.title }}</td>
              <td :class="[itemStyle()]">{{ history.version }}</td>
              <td :class="[itemStyle()]">
                {{
                  history.user_manual_history_id === oldestHistory.user_manual_history_id
                    ? formatDateTime(currentDataUserManual?.created_at)
                    : formatDateTime(history.updated_at)
                }}
              </td>
              <td :class="[itemStyle()]">
                {{
                  history.user_manual_history_id === oldestHistory.user_manual_history_id
                    ? 'Created By ' + history.initial_editor
                    : 'Edited By ' + history.latest_editor
                }}
              </td>
              <td :class="[itemStyle()]">{{ history.size }}</td>
              <td :class="[itemStyle()]"></td>
              <td :class="[itemStyle()]">
                <!-- <img
                  src="../../assets/icon/icon-delete.png"
                  alt="delete"
                  class="w-6 cursor-pointer hover:scale-110"
                  @click="openHistoryDeleteDialog(history)"
                /> -->
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Jika tidak ada currentDataUserManual atau history -->
      <section v-else>
        <h1>Tidak ada history</h1>
      </section>
    </div>
  </div>
</template>

<script setup>
import { showUserManualHistory } from '@/services/modules/UserManualHistoryService'
import { showUserManual } from '@/services/modules/UserManualService'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import UserManualDelete from './UserManualDelete.vue'
import HistoryDelete from './HistoryDelete.vue'
import { formatDateTime } from '@/helpers/FormatDate'
import NavbarComponent from '../NavbarComponent.vue'

let dataUserManualHistory = ref([])
let currentDataUserManual = ref()
const fetchingUserManualsHistory = ref(false)
const route = useRoute()

// Dialog state
const showDeleteDialog = ref(false)
const showHistoryDeleteDialog = ref(false)
const itemToDelete = ref(null)
const itemToDeleteHistory = ref(null)

// Dialog handlers for currentDataUserManual
const openDeleteDialog = (item) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  itemToDelete.value = null
}

// Dialog handlers for history
// const openHistoryDeleteDialog = (history) => {
//   itemToDeleteHistory.value = history
//   showHistoryDeleteDialog.value = true
// }

const closeHistoryDeleteDialog = () => {
  showHistoryDeleteDialog.value = false
  itemToDeleteHistory.value = null
}

// Use computed property for sorted history
const sortedHistory = computed(() => {
  return [...dataUserManualHistory.value].sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at)
  })
})

// Find the oldest history item for "Created By"
const oldestHistory = computed(() => {
  return dataUserManualHistory.value.length > 0
    ? dataUserManualHistory.value.reduce((oldest, current) =>
        new Date(current.updated_at) < new Date(oldest.updated_at) ? current : oldest
      )
    : null
})

onMounted(async () => {
  try {
    fetchingUserManualsHistory.value = true
    const historyResponse = await showUserManualHistory(route.params.id)
    dataUserManualHistory.value = Array.isArray(historyResponse) ? historyResponse : [] // Ensure it's an array
    currentDataUserManual.value = await showUserManual(route.params.id)
    console.log(currentDataUserManual.value)
    console.log(oldestHistory.value)
  } catch (error) {
    console.log(error)
  } finally {
    fetchingUserManualsHistory.value = false
  }
})

const itemStyle = () => {
  return 'px-4 py-7 border-b-2 border-grey-background'
}
</script>
