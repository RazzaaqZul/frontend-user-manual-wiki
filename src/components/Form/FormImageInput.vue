<template>
  <div class="upload-container flex justify-center items-center w-full gap-6">
    <!-- Image Preview -->
    <img v-if="cover" :src="cover" alt="Cover Preview" class="w-[6%]" />
    <img v-else src="../../assets/images/image-default.png" alt="Cover Preview" class="w-[6%]" />

    <!-- Radio buttons to switch between file or URL -->
    <SelectButton
      v-model="uploadMethod"
      :options="options"
      optionLabel="label"
      optionValue="value"
      class="w-96"
      allowEmpty
    />

    <!-- Display file input if 'file' is selected -->
    <div v-if="uploadMethod === 'file'" class="flex items-center justify-between w-full">
      <input
        type="file"
        @change="onFileChange"
        class="file-input border-field p-1 w-full basis-[79%]"
      />
      <button type="button" class="upload-button basis-[21%]">Set Image</button>
    </div>

    <!-- Display URL input if 'url' is selected -->
    <div v-if="uploadMethod === 'url'" class="flex items-center justify-between w-full">
      <input
        type="text"
        v-model="imageUrl"
        placeholder="Enter image URL"
        class="border-field p-2 w-full basis-[79%]"
      />
      <button type="button" class="upload-button basis-[21%]" @click="setImageUrl">
        Set Image
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SelectButton from 'primevue/selectbutton'

// Props for image handling
const props = defineProps({
  img: String,
  form: Object
})

// Emit for updates
const emit = defineEmits(['update:img'])

// Options for upload method
const options = [
  { label: 'Upload File', value: 'file', constant: true },
  { label: 'URL Image', value: 'url', constant: false }
]

// Local state
const cover = ref(props.img || '')
const imageUrl = ref('') // For storing the image URL
const uploadMethod = ref('file') // Default method is file upload

// Watch for changes to the img prop and update local cover and imageUrl accordingly
watch(
  () => props.img,
  (newImg) => {
    if (newImg && newImg.startsWith('http')) {
      imageUrl.value = newImg // If it's a URL, set imageUrl
    } else {
      cover.value = newImg // Otherwise, set the cover for file upload
    }
  },
  { immediate: true } // Ensure the watcher runs immediately when the component is mounted
)

// Function to handle file change
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      cover.value = e.target.result
      emit('update:img', e.target.result) // Emit the updated image data as base64
    }
    reader.readAsDataURL(file)
  }
}

// Function to handle URL image input
const setImageUrl = () => {
  if (imageUrl.value) {
    cover.value = imageUrl.value
    emit('update:img', imageUrl.value) // Emit the updated image URL
  }
}

// Keep track of the previous value for the SelectButton
let previousValue = 'file'
watch(uploadMethod, (newValue) => {
  if (!newValue) {
    // If value is empty, reset it to the previous value
    uploadMethod.value = previousValue
  } else {
    // Update previous value whenever a valid new value is selected
    previousValue = newValue
  }
})

// Watch imageUrl and update cover when the URL changes
watch(imageUrl, (newUrl) => {
  if (newUrl) {
    cover.value = newUrl
    emit('update:img', newUrl) // Emit the new image URL
  }
})
</script>

<style scoped>
/* Image preview and file input styles */
.upload-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.upload-button {
  background-color: #ccc;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.border-field {
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
