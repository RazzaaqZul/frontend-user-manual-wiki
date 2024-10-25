<template>
  <!-- Sidebar -->
  <nav class="bg-yellow-custom">
    <MainSideBar :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
  </nav>

  <!-- Main content -->
  <div
    :class="[
      'flex justify-center items-center min-h-screen duration-300',
      sidebarOpen ? 'translate-x-[5%]' : ''
    ]"
  >
    <div class="flex flex-col justify-start items-center w-fit h-full min-w-[60%] min-h-screen">
      <!-- Header 1 user manual -->
      <section class="flex justify-between gap-[8%] items-center w-full my-7">
        <!-- button sidebar -->
        <div class="absolute left-[3%] flex justify-center items-center gap-5">
          <div
            class="w-fit bg-soft-blue p-3 rounded-full shadow-lg drop-shadow-lg cursor-pointer"
            @click="toggleSidebar"
          >
            <!-- icon sidebar -->
            <img src="../assets/icon/icon-humberger-bar.png" class="w-5" />
          </div>
          <img src="../assets/icon/logo-bpjamsostek-color.png" class="w-36" />
        </div>
        <!-- fitur search -->
        <SearchComponent class="basis-[65%]" />
        <!-- login button -->
        <ButtonLogin />
      </section>

      <!-- Header 2 user manual -->
      <section
        class="flex justify-between items-center border-b-[3px] border-grey-background mb-5 pb-1 w-full"
      >
        <h1 class="font-bold text-[30px] text-soft-blue">Halaman Utama</h1>
        <div class="flex justify-center items-center gap-2">
          <FilterPopOver @categorySelected="onCategorySelected" />
          <RouterLink to="/main/user-manuals/create">
            <MainButtonCreate />
          </RouterLink>
          <RouterLink to="/main/admin/trash">
            <MainButtonTrash />
          </RouterLink>
          <RouterLink to="main/admin/manage-user">
            <UserButton />
          </RouterLink>
        </div>
      </section>

      <!-- list user manual -->
      <MainMenu :selectedCategory="selectedCategory" />
    </div>
  </div>
</template>

<script setup>
import ButtonLogin from '@/components/ButtonLogin.vue'
import MainMenu from '@/components/Main/MainMenu.vue'
import MainSideBar from '@/components/Main/MainSideBar.vue'
import SearchComponent from '@/components/Search/SearchBar.vue'
import { ref } from 'vue'
import MainButtonCreate from '../components/Main/MainButtonCreate.vue'
import MainButtonTrash from '@/components/Main/MainButtonTrash.vue'
import FilterPopOver from '@/components/Filter/FilterPopOver.vue'
import UserButton from '@/components/Auth/User/UserButton.vue'

const sidebarOpen = ref(false)
const selectedCategory = ref(null)

// Toggle sidebar state
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Handle the selected category from FilterPopOver
const onCategorySelected = (category) => {
  selectedCategory.value = category.value // Store the selected category
}
</script>
