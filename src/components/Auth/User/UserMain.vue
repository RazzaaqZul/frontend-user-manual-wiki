<template>
  <div class="px-[10%] py-4">
    <h2 class="text-2xl font-bold text-soft-blue border-b-4 border-grey-input py-5 mb-5">
      Pengguna
    </h2>

    <section
      v-if="users && users.length > 0"
      class="border-grey-button border-2 p-4 sm:p-7 rounded-xl overflow-x-auto"
    >
      <div class="card">
        <DataTable :value="users" tableStyle="min-width: 50rem" responsiveLayout="scroll">
          <Column field="name" header="Name" style="width: 150px" class="sm:w-40 md:w-60"></Column>

          <Column
            field="email"
            header="Nama"
            style="width: 200px"
            class="break-all sm:w-40 md:w-60"
          ></Column>
          <Column field="role" header="Peran" style="width: 100px" class="sm:w-32 md:w-48"></Column>
          <Column
            field="created_at"
            header="Dibuat pada"
            style="width: 200px"
            class="sm:w-40"
          ></Column>
          <Column
            field="updated_at"
            header="Terakhir Login"
            style="width: 250px"
            class="sm:w-40"
          ></Column>

          <Column style="width: 150px">
            <template #body="slotProps">
              <div class="flex flex-wrap gap-2">
                <!-- Button Delete -->
                <button
                  v-if="!isCurrentUser(slotProps.data.user_id)"
                  class="bg-dark-red hover:bg-red-custom hover:scale-105 duration-200 rounded-full p-2 flex items-center justify-center"
                  @click="openDeleteDialog(slotProps.data)"
                >
                  <img
                    src="../../../assets/icon/icon-delete-white.png"
                    alt="icon-delete-white"
                    class="w-4 sm:w-5 lg:w-6 h-auto block"
                  />
                </button>

                <!-- Button Edit -->
                <button
                  class="bg-dark-blue hover:bg-soft-blue hover:scale-105 duration-200 rounded-full p-2 flex items-center justify-center"
                  @click="openEditDialog(slotProps.data)"
                >
                  <img
                    src="../../../assets/icon/icon-edit-white.png"
                    alt="icon-edit"
                    class="w-4 sm:w-5 lg:w-6 h-auto block"
                  />
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <section v-else class="flex justify-center items-center h-[50vh]">
      <ProgressSpinner />
    </section>

    <!-- User Dialog Form -->
    <UserDialogForm
      :visible="dialogVisible"
      :user="selectedUser"
      @update:visible="dialogVisible = $event"
    />

    <UserDeleteDialogForm
      :visible="deleteDialogVisible"
      :user="selectedUser"
      @update:visible="deleteDialogVisible = $event"
      @userDeleted="handleUserDeleted"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import UserDialogForm from './UserDialogForm.vue' // Adjust the path as necessary
import UserDeleteDialogForm from './UserDeleteDialogForm.vue'

defineProps({
  users: Array
})

const dialogVisible = ref(false)
const selectedUser = ref(null)
const deleteDialogVisible = ref(false)

// Function to open the edit dialog with the selected user data
const openEditDialog = (user) => {
  selectedUser.value = user // Set user yang dipilih
  dialogVisible.value = true // Buka dialog
}

// Function to open the delete dialog with the selected user data
const openDeleteDialog = (user) => {
  selectedUser.value = user // Set user yang dipilih
  deleteDialogVisible.value = true // Buka dialog
}

// Handle user deletion
const handleUserDeleted = (deletedUser) => {
  console.log('User was deleted:', deletedUser)
  // Optionally, you can filter out the deleted user from your list
}

// Function to check if the current user is the same as the user being displayed
const currentUser = JSON.parse(localStorage.getItem('user')) // Assuming this is how you store the user in localStorage
const isCurrentUser = (userId) => {
  return currentUser && currentUser.user_id === userId
}
</script>
