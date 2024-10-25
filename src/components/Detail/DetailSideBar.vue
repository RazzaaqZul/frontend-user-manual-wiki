<template>
  <section
    v-if="dataUserManual && dataUserManual.content"
    class="w-[20%] h-screen shadow-inner-thick sticky top-0 py-24 overflow-y-auto"
  >
    <div class="flex justify-between items-center cursor-pointer px-10">
      <h1>Contents</h1>
      <div class="bg-soft-blue rounded-full p-1 hover:scale-110 duration-300">
        <img src="../../assets/icon/icon-x.png" class="w-4" />
      </div>
    </div>
    <div class="mt-5">
      <ul class="flex flex-col gap-2 cursor-pointer">
        <li
          v-for="subTopic in getSubTopics(dataUserManual.content)"
          :key="subTopic.user_manual_id"
          @click="setActiveSubTopic(subTopic.id)"
        >
          <div
            :class="[
              {
                'active-item': isActive(subTopic.id),
                'non-active-item': !isActive(subTopic.id)
              },
              'w-full px-5 py-2 mt-3 duration-300 font-semibold'
            ]"
          >
            <a :href="`#${subTopic.id}`">
              <h2
                :class="[
                  {
                    'active-text': isActive(subTopic.id),
                    'text-soft-blue': !isActive(subTopic.id)
                  },
                  '' // static class
                ]"
              >
                {{ subTopic.title }}
              </h2>
            </a>
          </div>
          <ul class="flex flex-col gap-1">
            <li
              v-for="subSubTopic in subTopic.subTopics"
              :key="subSubTopic.id"
              @click.stop="setActiveSubSubTopic(subSubTopic.id, subTopic.id)"
            >
              <div
                :class="[
                  {
                    'active-item': isActiveSubSub(subSubTopic.id),
                    'non-active-item text-soft-blue': !isActiveSubSub(subSubTopic.id)
                  },
                  'w-full px-10 duration-300  mt-1 py-1'
                ]"
              >
                <a :href="`#${subSubTopic.id}`">
                  {{ subSubTopic.title }}
                </a>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
  <div v-else>Loading content...</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getSubTopics } from '@/helpers/GetSubTopics'

/**
 * SubTopic = h1
 * SubSubTopic = h2
 */

const props = defineProps({
  dataUserManual: {
    type: Object,
    default: () => ({ content: [] }) // Default value jika data belum ada
  }
})

console.log(props.dataUserManual)
// Reactive properties untuk menyimpan subtopik dan sub-subtopik yang aktif
const activeSubTopic = ref(null)
const activeSubSubTopic = ref(null) // Tambahkan ini untuk menyimpan sub-subtopik yang aktif

// Method untuk mengatur subtopik yang aktif
const setActiveSubTopic = (id) => {
  console.log(id)
  activeSubTopic.value = id
  activeSubSubTopic.value = null // Reset sub-subtopik ketika subtopik diubah
}

const setActiveSubSubTopic = (subSubId, subTopicId) => {
  console.log(subSubId)
  activeSubSubTopic.value = subSubId
  activeSubTopic.value = subTopicId // Tetapkan subtopik aktif berdasarkan sub-subtopik yang diklik
}

// Method untuk mengecek apakah subtopik aktif
const isActive = (id) => {
  return (
    activeSubTopic.value === id ||
    (activeSubTopic.value !== null &&
      activeSubSubTopic.value !== null &&
      getSubTopics(props.dataUserManual.content).some(
        (subTopic) =>
          subTopic.id === id &&
          subTopic.subTopics.some((subSubTopic) => subSubTopic.id === activeSubSubTopic.value)
      ))
  )
}

// Method untuk mengecek apakah sub-subtopik aktif
const isActiveSubSub = (id) => {
  return activeSubSubTopic.value === id
}

const currentSection = ref('')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentSection.value = entry.target.getAttribute('id')
          const id = currentSection.value

          // Update activeSubTopic and activeSubSubTopic based on the current section
          if (entry.target.tagName === 'H1') {
            activeSubTopic.value = id // Set active subtopic for h1
            console.log(`H1 ` + id)
          } else if (entry.target.tagName === 'H2') {
            activeSubSubTopic.value = id // Set active sub-subtopic for h2
            activeSubTopic.value = id // Set the parent h1 as active subtopic
          }
        }
      })
    },
    {
      threshold: 0.6 // Element considered visible when 60% is visible
    }
  )

  // Observe all h1 and h2 tags
  document.querySelectorAll('h1, h2').forEach((section) => {
    observer.observe(section)
  })

  // Check if there's an #id in the URL and scroll to the corresponding section
  const urlHash = window.location.hash.substring(1) // Remove the # symbol
  checkHashId(urlHash)
})

// Check #id
const checkHashId = (urlHash) => {
  console.log('Dijalankan')
  console.log(urlHash)
  if (urlHash) {
    const targetSection = document.getElementById(urlHash)
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' }) // Smooth scroll to the section
      currentSection.value = urlHash

      // Update the active subtopic or sub-subtopic based on the section ID
      if (targetSection.tagName === 'H1') {
        activeSubTopic.value = urlHash // Set active subtopic for H1
      } else if (targetSection.tagName === 'H2') {
        activeSubSubTopic.value = urlHash // Set active sub-subtopic for H2
        activeSubTopic.value = urlHash // Set active parent topic for H2
      }
    }
  }
}

// Menggunakan watch untuk memantau perubahan pada currentSection
watch(currentSection, (newValue) => {
  console.log(newValue)
})
</script>

<style scoped>
.active-item {
  background-color: #f5f5d5; /* Light yellow background */
  border-radius: 4px;
}

.non-active-item {
  background-color: transparent;
}

.active-item-wrapper {
  background-color: #f5f5d5; /* Full width yellow background */
  width: 100%;
}

.active-text {
  color: black; /* Black text for active */
}

.text-soft-blue {
  color: #3b82f6; /* Blue for non-active text */
}

.active-item:hover {
  opacity: 0.8;
}
</style>
