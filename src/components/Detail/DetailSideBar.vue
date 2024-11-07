<template>
  <section
    v-if="dataUserManual && dataUserManual.content"
    class="w-[20%] h-screen shadow-inner-thick sticky top-0 py-24 overflow-y-auto scrollbar scrollbar-thumb-white-background"
    ref="sidebarRef"
    @scroll="handleManualScroll"
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
          :ref="(el) => setItemRef(el, subTopic.id)"
        >
          <div
            :class="[
              {
                'active-item': isActive(subTopic.id),
                'non-active-item': !isActive(subTopic.id)
              },
              'w-full px-5 py-2 mt-3 duration-300 font-semibold z-50'
            ]"
          >
            <a :href="`#${subTopic.id}`">
              <h2
                :class="[
                  {
                    'active-text': isActive(subTopic.id),
                    'text-soft-blue': !isActive(subTopic.id)
                  },
                  'text-sm '
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
              :ref="(el) => setItemRef(el, subSubTopic.id)"
            >
              <div
                :class="[
                  {
                    'active-item': isActiveSubSub(subSubTopic.id),
                    'non-active-item text-soft-blue': !isActiveSubSub(subSubTopic.id)
                  },
                  'w-full px-10 duration-300 mt-1 py-1 z-10'
                ]"
              >
                <a
                  :href="`#${decodeHtmlEntities(subSubTopic.id)}`"
                  v-html="decodeHtmlEntities(subSubTopic.title)"
                  class="text-sm"
                ></a>
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { getSubTopics } from '@/helpers/GetSubTopics'

const props = defineProps({
  dataUserManual: {
    type: Object,
    default: () => ({ content: [] })
  }
})

const sidebarRef = ref(null)
const itemRefs = ref({})
const isUserScrolling = ref(false)
const scrollTimeout = ref(null)

// Function to handle manual scrolling
const handleManualScroll = () => {
  isUserScrolling.value = true

  // Clear any existing timeout
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }

  // Reset the flag after a short delay
  scrollTimeout.value = setTimeout(() => {
    isUserScrolling.value = false
  }, 150) // Adjust timeout as needed
}

const setItemRef = (el, id) => {
  if (el) {
    itemRefs.value[id] = el
  }
}

const scrollToActive = (id) => {
  // Don't auto-scroll if user is manually scrolling
  if (isUserScrolling.value || !id || !itemRefs.value[id] || !sidebarRef.value) return

  const element = itemRefs.value[id]
  const sidebar = sidebarRef.value

  // Calculate positions
  const elementRect = element.getBoundingClientRect()
  const sidebarRect = sidebar.getBoundingClientRect()

  // Check if element is not fully visible in the sidebar
  if (elementRect.top < sidebarRect.top || elementRect.bottom > sidebarRect.bottom) {
    const scrollTop = element.offsetTop - sidebar.clientHeight / 2 + element.clientHeight / 2

    sidebar.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
  }
}

const decodeHtmlEntities = (str) => {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

const activeSubTopic = ref(null)
const activeSubSubTopic = ref(null)

const setActiveSubTopic = (id) => {
  // Temporarily disable auto-scroll when clicking links
  isUserScrolling.value = true
  activeSubTopic.value = id
  activeSubSubTopic.value = null

  // Reset the flag after a delay
  setTimeout(() => {
    isUserScrolling.value = false
  }, 1000) // Longer delay for click actions
}

const setActiveSubSubTopic = (subSubId, subTopicId) => {
  // Temporarily disable auto-scroll when clicking links
  isUserScrolling.value = true
  activeSubSubTopic.value = subSubId
  activeSubTopic.value = subTopicId

  // Reset the flag after a delay
  setTimeout(() => {
    isUserScrolling.value = false
  }, 1000) // Longer delay for click actions
}

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

const isActiveSubSub = (id) => {
  return activeSubSubTopic.value === id
}

const currentSection = ref('')

// Watch for changes in active sections and scroll them into view
watch([activeSubTopic, activeSubSubTopic], ([newSubTopic, newSubSubTopic]) => {
  // Only scroll if not user-initiated
  if (!isUserScrolling.value) {
    if (newSubSubTopic) {
      scrollToActive(newSubSubTopic)
    } else if (newSubTopic) {
      scrollToActive(newSubTopic)
    }
  }
})

onMounted(() => {
  let previousH2Id = ''

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tagName = entry.target.tagName
          const id = entry.target.getAttribute('id')

          if (tagName === 'H1') {
            activeSubTopic.value = id
            activeSubSubTopic.value = null
            scrollToActive(id)
          } else if (tagName === 'H2') {
            const activeH2Id = id || previousH2Id
            if (activeH2Id) {
              activeSubSubTopic.value = activeH2Id
              activeSubTopic.value = entry.target.closest('h1')?.getAttribute('id')
              scrollToActive(activeH2Id)
            }
            if (id) previousH2Id = id
          }
        }
      })
    },
    {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0.1
    }
  )

  document.querySelectorAll('h1, h2').forEach((section) => {
    observer.observe(section)
  })

  const urlHash = window.location.hash.substring(1)
  checkHashId(urlHash)
})

const checkHashId = (urlHash) => {
  if (urlHash) {
    const targetSection = document.getElementById(urlHash)
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' })
      currentSection.value = urlHash

      if (targetSection.tagName === 'H1') {
        activeSubTopic.value = urlHash
        scrollToActive(urlHash)
      } else if (targetSection.tagName === 'H2') {
        activeSubSubTopic.value = urlHash
        activeSubTopic.value = targetSection.closest('h1')?.getAttribute('id')
        scrollToActive(urlHash)
      }
    }
  }
}

watch(currentSection, (newValue) => {
  if (newValue && !isUserScrolling.value) {
    scrollToActive(newValue)
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})
</script>

<style scoped>
.active-item {
  background-color: #f5f5d5;
  border-radius: 4px;
  position: sticky;
  top: -14vh;
}

.non-active-item {
  background-color: transparent;
}

.active-item-wrapper {
  background-color: #f5f5d5;
  width: 100%;
}

.active-text {
  color: black;
}

.text-soft-blue {
  color: #3b82f6;
}

.active-item:hover {
  opacity: 0.8;
}
</style>
