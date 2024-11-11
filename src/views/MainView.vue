<template>
  <nav class="">
    <MainSideBar :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
  </nav>

  <div
    :class="[
      'flex justify-center items-center min-h-screen duration-300',
      sidebarOpen ? ' md:translate-x-[12%] xl:translate-x-[8.5%] 2xl:translate-x-[4%]' : ''
    ]"
  >
    <div
      class="flex flex-col justify-start items-center w-fit h-full min-w-[80%] md:min-w-[72%] lg:min-w-[75%] xl:min-w-[71%] 2xl:min-w-[60%] max-w-[60%] min-h-screen"
    >
      <!-- Header Section XL -->
      <section class="xl:flex justify-between gap-[8%] items-center w-full my-7 hidden">
        <div class="absolute left-[3%] flex justify-center items-center gap-5">
          <!-- SideBar -->
          <div
            class="w-fit bg-soft-blue p-3 rounded-full shadow-lg drop-shadow-lg cursor-pointer"
            @click="toggleSidebar"
          >
            <img src="../assets/icon/icon-humberger-bar.png" class="w-5" />
          </div>
          <!-- Logo BPJS Ketenagakerjaan -->
          <RouterLink to="/">
            <img
              src="../assets/icon/logo-bpjamsostek-color.png"
              class="w-36 hidden xl:block xl:w-20 2xl:w-36 cursor-pointer hover:scale-105 duration-200"
            />
          </RouterLink>
        </div>
        <SearchComponent
          @update:searchResults="handleSearchResults"
          @search-loading="isSearchLoading = $event"
          class="basis-[65%]"
        />
        <ButtonLogin />
      </section>

      <!-- Header Section SM, MD, LG -->
      <section class="flex flex-col justify-center items-center w-full my-7 gap-5 xl:hidden">
        <div class="w-full flex justify-center gap-2 md:gap-10 items-center">
          <!-- SideBar -->
          <div
            class="w-fit bg-soft-blue p-3 rounded-full shadow-lg drop-shadow-lg cursor-pointer"
            @click="toggleSidebar"
          >
            <img src="../assets/icon/icon-humberger-bar.png" class="w-5" />
          </div>
          <!-- Logo BPJS Ketenagakerjaan -->
          <RouterLink to="/">
            <img
              src="../assets/icon/logo-bpjamsostek-color.png"
              class="w-56 md:w-56 cursor-pointer hover:scale-105 duration-200"
            />
          </RouterLink>
          <ButtonLogin />
        </div>
        <SearchComponent
          @update:searchResults="handleSearchResults"
          @search-loading="isSearchLoading = $event"
          class="w-full"
        />
      </section>
      <!-- Title and Controls Section -->
      <section
        class="flex flex-col justify-start md:flex-row md:justify-between items-center border-b-[3px] border-grey-background mb-5 pb-1 w-full"
      >
        <h1 class="w-full basis-[70%] font-bold text-[30px] text-soft-blue">Halaman Utama</h1>
        <div class="w-full flex flex-wrap justify-end items-center gap-2">
          <FilterPopOver
            @categorySelected="onCategorySelected"
            :class="[
              'animate__animated cursor-pointer',
              !route.query.search ? 'animate__fadeInRight' : 'animate__fadeOutRight'
            ]"
          />
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

      <!-- Loading State -->
      <div v-if="isSearchLoading" class="w-full flex justify-center items-center min-h-[50vh]">
        <ProgressSpinner />
      </div>

      <!-- Search Results -->
      <section v-else-if="isSearchActive" class="w-full">
        <!-- Search Results Count -->
        <div v-if="route.query.search" class="flex flex-col justify-start gap-2 mb-5">
          <template v-if="actualMatchCount > 0">
            <h1 class="text-dark-blue text-xl font-semibold">
              {{ actualMatchCount }} results found
            </h1>
            <h2 class="text-grey-word">
              Create the page
              <span class="text-soft-blue font-semibold">"{{ route.query.search }}"</span>
              on this wiki! See also the search results found.
            </h2>
          </template>
          <template v-else>
            <SearchNotFound />
          </template>
        </div>

        <!-- Search Results List -->
        <div class="flex flex-col gap-5">
          <div v-for="(result, index) in searchResults" :key="index" class="w-full">
            <SearchMain :user_manual="result" @search-result="handleSearchMatch(index, $event)" />
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section v-else class="w-full">
        <MainMenu :selectedCategory="selectedCategory" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ButtonLogin from '@/components/ButtonLogin.vue'
import MainMenu from '@/components/Main/MainMenu.vue'
import MainSideBar from '@/components/Main/MainSideBar.vue'
import SearchComponent from '@/components/Search/SearchBar.vue'
import MainButtonCreate from '@/components/Main/MainButtonCreate.vue'
import MainButtonTrash from '@/components/Main/MainButtonTrash.vue'
import FilterPopOver from '@/components/Filter/FilterPopOver.vue'
import UserButton from '@/components/Auth/User/UserButton.vue'
import SearchNotFound from '@/components/Search/SearchNotFound.vue'
import SearchMain from '@/components/Search/SearchMain.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { validateToken } from '@/services/modules/UserService'

const route = useRoute()
const sidebarOpen = ref(false)
const selectedCategory = ref(null)
const searchResults = ref([])
const searchMatchMap = ref(new Map())
const isSearchLoading = ref(false)
const userRole = ref(null)

// Compute whether search is active
const isSearchActive = computed(() => {
  return !!route.query.search || searchResults.value.length > 0
})

// Compute actual match count
const actualMatchCount = computed(() => {
  return Array.from(searchMatchMap.value.values()).filter(Boolean).length
})

// Role-based computed properties
const isAdmin = computed(() => userRole.value === 'admin')
const canCreate = computed(
  () => userRole.value === 'admin' || userRole.value === 'technical_writer'
)

// Fetch user role
const fetchUserRole = async () => {
  const getToken = localStorage.getItem('token')
  const token = getToken ? JSON.parse(getToken).token : null

  if (token) {
    const userData = await validateToken(token)
    if (userData) {
      userRole.value = userData.role
    }
  }
}

// Handle search results from SearchComponent
const handleSearchResults = (results) => {
  searchResults.value = results
  searchMatchMap.value = new Map() // Reset match map
}

// Handle individual search matches
const handleSearchMatch = (index, hasMatch) => {
  searchMatchMap.value.set(index, hasMatch)
}

// Toggle sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Handle category selection
const onCategorySelected = (category) => {
  selectedCategory.value = category.value
}

onMounted(async () => {
  await fetchUserRole()
})
</script>
