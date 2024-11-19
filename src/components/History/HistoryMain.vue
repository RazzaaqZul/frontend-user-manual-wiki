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
        Riwayat
      </h2>

      <!-- Tampilkan tabel dengan currentDataUserManual sebagai baris pertama -->
      <section
        v-if="currentDataUserManual || dataUserManualHistory"
        class="border-grey-button border-2 p-7 rounded-xl"
      >
        <div
          class="text-soft-blue text-lg font-semibold border-b-4 border-grey-background rounded py-5"
        >
          <span class="text-green-custom">Riwayat Revisi</span>
          {{ currentDataUserManual?.title }}
        </div>
        <table class="min-w-full table-fixed overflow-x-auto">
          <thead class="hidden lg:table-header-group">
            <tr>
              <th class="px-4 py-2 text-left">Dokumen</th>
              <th class="px-4 py-2 text-left">Judul</th>
              <th class="px-4 py-2 text-left">Versi</th>
              <th class="px-4 py-2 text-left">Deskripsi Perubahan</th>
              <th class="px-4 py-2 text-left">Diperbarui</th>
              <th class="px-4 py-2 text-left">Pengubah</th>
              <th class="px-4 py-2 text-left">Ukuran File</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="currentDataUserManual" class="block lg:table-row">
              <td :class="itemStyle()" data-label="File">
                <div class="flex justify-center items-center">
                  <img src="../../assets/icon/icon-file.png" class="w-8" alt="logo-file" />
                </div>
              </td>
              <td :class="itemStyle()" data-label="Title">{{ currentDataUserManual.title }}</td>
              <td :class="itemStyle()" data-label="Version">{{ currentDataUserManual.version }}</td>
              <td :class="itemStyle()" data-label="Deskripsi Perubahan">
                {{ currentDataUserManual.update_desc }}
              </td>
              <td :class="itemStyle()" data-label="Updated At">
                {{ formatDateTime(currentDataUserManual.updated_at) }}
              </td>
              <td :class="itemStyle()" data-label="Editor">
                {{
                  dataUserManualHistory.length !== 0
                    ? 'Diubah oleh ' + currentDataUserManual.latest_editor
                    : 'Dibuat oleh ' + currentDataUserManual.initial_editor
                }}
              </td>
              <td :class="itemStyle()" data-label="Size">{{ currentDataUserManual.size }}</td>
              <td :class="itemStyle()" data-label="Status" class="text-soft-blue italic">
                Versi Terbaru
              </td>
              <td :class="itemStyle()" data-label="Action">
                <img
                  src="../../assets/icon/icon-delete.png"
                  alt="delete"
                  class="w-6 cursor-pointer hover:scale-110"
                  @click="openDeleteDialog(currentDataUserManual)"
                />
              </td>
            </tr>

            <!-- Rows for sorted history -->
            <tr
              v-for="history in sortedHistory"
              :key="history.user_manual_history_id"
              class="block lg:table-row"
            >
              <td :class="itemStyle()" data-label="File">
                <RouterLink
                  :to="`/main/user-manuals/${history.user_manual_id}/histories/${history.user_manual_history_id}/detail`"
                >
                  <div class="flex flex-col items-center">
                    <img src="../../assets/icon/icon-file.png" class="w-8" alt="logo-file" />
                    <p class="text-sm text-soft-blue italic hover:underline duration-300">
                      Lihat detail
                    </p>
                  </div>
                </RouterLink>
              </td>
              <td :class="itemStyle()" data-label="Title">{{ history.title }}</td>
              <td :class="itemStyle()" data-label="Version">{{ history.version }}</td>
              <td :class="itemStyle()" data-label="Deskripsi Perubahan">
                {{ history.update_desc }}
              </td>
              <td :class="itemStyle()" data-label="Updated At">
                {{
                  history.user_manual_history_id === oldestHistory.user_manual_history_id
                    ? formatDateTime(currentDataUserManual?.created_at)
                    : formatDateTime(history.updated_at)
                }}
              </td>
              <td :class="itemStyle()" data-label="Editor">
                {{
                  history.user_manual_history_id === oldestHistory.user_manual_history_id
                    ? 'Dibuat oleh ' + history.initial_editor
                    : 'Diubah oleh ' + history.latest_editor
                }}
              </td>
              <td :class="itemStyle()" data-label="Size">{{ history.size }}</td>
              <td :class="itemStyle()" data-label="Status"></td>
              <td :class="itemStyle()" data-label="Action">
                <!-- Uncomment to enable delete action -->
                <!-- <img src="../../assets/icon/icon-delete.png" alt="delete" class="w-6 cursor-pointer hover:scale-110" @click="openHistoryDeleteDialog(history)" /> -->
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
    console.log('User History')
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
