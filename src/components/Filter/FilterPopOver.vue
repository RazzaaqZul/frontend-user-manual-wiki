<template>
  <div class="card flex justify-center">
    <FilterButton
      :label="selectedCategory ? selectedCategory.name : 'Semua'"
      @click="toggle"
      class="w-28"
    />

    <Popover ref="op">
      <div class="flex flex-col gap-4">
        <div>
          <span class="font-semibold block mb-2 text-dark-blue">Filter by Category</span>
          <ul class="list-none p-0 m-0 flex flex-col">
            <li
              v-for="category in categories"
              :key="category.name"
              class="flex items-center gap-2 px-2 py-2 hover:bg-emphasis cursor-pointer rounded-border"
              @click="selectCategory(category)"
            >
              <div>
                <span class="font-medium text-soft-blue">{{ category.name }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import Popover from 'primevue/popover'
import { ref } from 'vue'
import FilterButton from './FilterButton.vue'
const emit = defineEmits(['toggle', 'categorySelected'])

const op = ref()
const selectedCategory = ref(null)
const categories = ref([
  { name: 'Ekternal', value: 'eksternal' },
  { name: 'Internal', value: 'internal' },
  { name: 'Semua', value: '' }
])

const selectCategory = (category) => {
  selectedCategory.value = category
  emit('categorySelected', category) // Emit category selected event
  op.value.hide()
}

const toggle = (event) => {
  if (op.value) {
    op.value.toggle(event) // Toggle the Popover visibility
  }
}
</script>
