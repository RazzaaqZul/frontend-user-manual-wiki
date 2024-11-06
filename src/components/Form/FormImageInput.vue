<template>
  <div class="upload-container flex items-center w-full gap-6">
    <!-- Image Preview -->
    <img v-if="cover" :src="cover" alt="Cover Preview" class="w-[6%]" />
    <img v-else src="../../assets/images/image-default.png" alt="Cover Preview" class="w-[6%]" />

    <!-- File input for image upload -->
    <section class="w-full">
      <div v-if="uploadMethod === 'file'" class="flex justify-start w-full gap-4">
        <FileUpload
          ref="fileupload"
          mode="basic"
          :maxFileSize="1000000"
          @select="onFileSelect"
          :auto="true"
          chooseLabel="Pilih Gambar"
          accept="image/*"
          class="bg-soft-blue"
        />
        <!-- Menampilkan nama file -->
      </div>
      <span v-if="selectedFileName" class="text-gray-600 truncate">
        {{ selectedFileName }}
      </span>
    </section>
  </div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'
import { ref, watch } from 'vue'

// Define props and emit
const props = defineProps({
  img: {
    type: [String, File],
    default: ''
  },
  form: Object
})
const emit = defineEmits(['update:img'])

// Local state
const cover = ref('')
const uploadMethod = ref('file')
const fileupload = ref()
const selectedFileName = ref('') // Tambahkan ref untuk nama file

// Watch for changes in the image prop
watch(
  () => props.img,
  async (newImg) => {
    if (newImg) {
      if (typeof newImg === 'string' && newImg.includes('images/user_manuals/')) {
        cover.value = `${import.meta.env.VITE_BASE_URL}/storage/${newImg}`
        selectedFileName.value = newImg.split('/').pop() // Ambil nama file dari path
      } else if (newImg instanceof File) {
        const base64Image = await fileToBase64(newImg)
        cover.value = base64Image
        selectedFileName.value = newImg.name // Set nama file
      }
    } else {
      cover.value = ''
      selectedFileName.value = '' // Reset nama file
    }
  },
  { immediate: true }
)

// Function to handle file selection
const onFileSelect = (event) => {
  const file = event.files[0]
  if (file) {
    emit('update:img', file)
    selectedFileName.value = file.name // Set nama file yang dipilih

    // Optional: Clear the upload after emitting
    if (fileupload.value) {
      fileupload.value.clear()
    }
  }
}

// Function to convert a File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}
</script>

<style scoped>
/* Optional: Style untuk container file upload */
.upload-container {
  min-height: 50px;
}

/* Optional: Style untuk nama file */
.truncate {
  max-width: 300px; /* atau sesuaikan dengan kebutuhan */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input-field {
  width: 100%;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}
</style>
