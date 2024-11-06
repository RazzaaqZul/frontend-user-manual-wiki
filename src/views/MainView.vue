<template>
  <nav class="bg-yellow-custom">
    <MainSideBar :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
  </nav>

  <div
    :class="[
      'flex justify-center items-center min-h-screen duration-300',
      sidebarOpen ? 'translate-x-[5%]' : ''
    ]"
  >
    <div
      class="flex flex-col justify-start items-center w-fit h-full min-w-[60%] max-w-[60%] min-h-screen"
    >
      <section class="flex justify-between gap-[8%] items-center w-full my-7">
        <div class="absolute left-[3%] flex justify-center items-center gap-5">
          <div
            class="w-fit bg-soft-blue p-3 rounded-full shadow-lg drop-shadow-lg cursor-pointer"
            @click="toggleSidebar"
          >
            <img src="../assets/icon/icon-humberger-bar.png" class="w-5" />
          </div>
          <RouterLink to="/">
            <img
              src="../assets/icon/logo-bpjamsostek-color.png"
              class="w-36 cursor-pointer hover:scale-105 duration-200"
            />
          </RouterLink>
        </div>
        <SearchComponent @update:searchResults="searchResults = $event" class="basis-[65%]" />
        <ButtonLogin />
      </section>

      <section
        class="flex justify-between items-center border-b-[3px] border-grey-background mb-5 pb-1 w-full"
      >
        <h1 class="font-bold text-[30px] text-soft-blue">Halaman Utama</h1>
        <div class="flex justify-center items-center gap-2">
          <FilterPopOver @categorySelected="onCategorySelected" />
          <RouterLink to="/main/user-manuals/create" v-if="canCreate">
            <MainButtonCreate />
          </RouterLink>
          <RouterLink to="/main/admin/trash" v-if="isAdmin">
            <MainButtonTrash />
          </RouterLink>
          <RouterLink to="/main/admin/manage-user" v-if="isAdmin">
            <UserButton />
          </RouterLink>
        </div>
      </section>

      <!-- list user manual -->
      <section v-if="searchResults" class="w-full">
        <MainMenu :selectedCategory="selectedCategory" :searchResults="searchResults" />
      </section>
      <section v-else>
        <SearchNotFound />
      </section>
    </div>
  </div>
</template>

<script setup>
import ButtonLogin from '@/components/ButtonLogin.vue'
import MainMenu from '@/components/Main/MainMenu.vue'
import MainSideBar from '@/components/Main/MainSideBar.vue'
import SearchComponent from '@/components/Search/SearchBar.vue'
import { ref, computed, onMounted } from 'vue'
import MainButtonCreate from '../components/Main/MainButtonCreate.vue'
import MainButtonTrash from '@/components/Main/MainButtonTrash.vue'
import FilterPopOver from '@/components/Filter/FilterPopOver.vue'
import UserButton from '@/components/Auth/User/UserButton.vue'
import SearchNotFound from '@/components/Search/SearchNotFound.vue'
import { validateToken } from '@/services/modules/UserService' // Adjust import as necessary

const sidebarOpen = ref(false)
const selectedCategory = ref(null)
const searchResults = ref([]) // Reactive property for search results
const userRole = ref(null) // Placeholder for user role

// Fetch user role function
const fetchUserRole = async () => {
  const getToken = localStorage.getItem('token')
  const token = getToken ? JSON.parse(getToken).token : null

  if (token) {
    const userData = await validateToken(token)
    if (userData) {
      userRole.value = userData.role // Store the user's role
    }
  }
}

// Call fetchUserRole on component mount
onMounted(async () => {
  await fetchUserRole()
})

// Computed properties for role checks
const isAdmin = computed(() => userRole.value === 'admin')
const canCreate = computed(
  () => userRole.value === 'admin' || userRole.value === 'technical_writer'
)

// Toggle sidebar state
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Handle the selected category from FilterPopOver
const onCategorySelected = (category) => {
  selectedCategory.value = category.value // Store the selected category
}
</script>
