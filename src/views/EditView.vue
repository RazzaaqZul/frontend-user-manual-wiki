<template>
  <div class="mb-5 px-[2%] sm:px-[10%] md:px-[10%] lg:px-[15%]">
    <NavbarComponent />
    <div class="flex justify-between items-center border-b-4 border-grey-input mb-5">
      <h2 class="text-2xl font-bold text-soft-blue py-5">Edit User Manual</h2>
      <RouterLink :to="`/main/user-manuals/${dataUserManual.user_manual_id}/histories`">
        <ButtonComponent
          icon="icon-history.png"
          name="History"
          color="white-background"
          border="border-2 border-soft-blue"
          text="text-soft-blue"
        />
      </RouterLink>
    </div>
    <FormUserManualLayout :form="dataUserManual" :isUpdate="true" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ButtonComponent from '../components/ButtonComponent.vue'
import FormUserManualLayout from '../layouts/FormUserManualLayout.vue'
import { onMounted, ref } from 'vue'
import { showUserManual } from '../services/modules/UserManualService'
import NavbarComponent from '@/components/NavbarComponent.vue'

let dataUserManual = ref([]) // reactive data
const fetchingUserManuals = ref(false)

const route = useRoute()

onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    dataUserManual.value = await showUserManual(route.params.id)
    console.log(dataUserManual.value)
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
  } finally {
    fetchingUserManuals.value = false
  }
})
</script>
