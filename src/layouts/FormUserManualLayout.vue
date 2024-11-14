<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="form-layout">
      <!-- Black Glassy Overlay -->
      <div
        v-if="showSuccessPopup || showErrorPopup || showSuccessEditPopup"
        class="fixed inset-0 bg-primary-black bg-opacity-50 z-50 animate__animated animate__fadeIn"
      ></div>
      <!-- Sampul (Cover) -->
      <div class="form-group">
        <label for="cover">Sampul:</label>
        <FormImageInput :img="form.img" @update:img="updateImage" :form="form" />
      </div>
      <label v-if="errorMessage?.img?.[0]" class="error-alert">
        {{ errorMessage?.img[0] }}
      </label>

      <!-- Judul (Title) -->
      <div class="form-group">
        <label for="title">Judul:</label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          placeholder="Masukkan judul"
          class="input-field"
        />
      </div>
      <label v-if="errorMessage?.title?.[0]" class="error-alert">
        {{ errorMessage.title[0] }}
      </label>

      <!-- Deskripsi Singkat -->
      <div class="form-group">
        <label for="short_desc">Deskripsi Singkat:</label>
        <input
          type="text"
          id="short_desc"
          v-model="form.short_desc"
          placeholder="Masukkan deskripsi singkat"
          class="input-field"
        />
      </div>
      <label v-if="errorMessage?.short_desc?.[0]" class="error-alert">
        {{ errorMessage.short_desc[0] }}
      </label>

      <!-- Creator -->
      <div class="form-group">
        <label for="creator">Pembuat:</label>
        <input
          type="text"
          id="initial_editor"
          v-model="creatorValue"
          :placeholder="form.creator ? form.creator : creatorValue"
          class="input-field"
          disabled
        />
      </div>

      <!-- Editor -->
      <div v-if="isUpdate" class="form-group">
        <label for="creator">Pengedit:</label>
        <input
          type="text"
          id="latest_editor"
          v-model="form.latest_editor"
          :placeholder="getEditor()"
          class="input-field"
          disabled
        />
      </div>

      <!-- Version -->
      <div class="form-group relative mb-6">
        <label for="version">Versi:</label>
        <input
          type="text"
          id="version"
          v-model="form.version"
          placeholder="Masukkan versi. Contoh: 1.0.0"
          class="input-field"
        />
        <div
          class="absolute top-[100px] sm:left-28 sm:top-14 flex justify-center items-center gap-2"
        >
          <img
            src="../assets/icon/icon-curious.png"
            class="w-6 hover:scale-105 cursor-pointer"
            label="Show"
            @click="visible = true"
          />
          <p class="text-sm text-soft-blue font-semibold">Bagaimana membuat versi?</p>
        </div>
      </div>
      <Dialog
        v-model:visible="visible"
        modal
        header="Edit Profile"
        :style="{ width: '45rem' }"
        class="m-4"
      >
        <template #header>
          <div class="inline-flex items-center justify-center gap-2">
            <span class="font-bold whitespace-nowrap">Penjelasan Versi</span>
          </div>
        </template>

        <p class="mb-4 text-justify">
          <strong>Versi 0.0.0</strong> menandakan tahap awal atau prototipe dari aplikasi. Format
          versi terdiri dari tiga angka:
        </p>
        <ul class="text-justify list-decimal px-10">
          <li>
            <strong>Mayor</strong>: Angka pertama menunjukkan perubahan besar dalam struktur atau
            isi panduan, seperti penambahan bab baru (Header 1), perubahan format utama, atau revisi
            besar-besaran pada konten.
          </li>
          <li>
            <strong>Minor</strong>: Angka kedua menunjukkan adanya penambahan atau modifikasi konten
            tanpa mengubah struktur panduan secara besar-besaran, misalnya, penambahan sub-bab
            (Header 2), penjelasan lebih detail, atau pengayaan informasi.
          </li>
          <li>
            <strong>Patch</strong>: Angka ketiga menunjukkan perbaikan kecil, seperti koreksi
            kesalahan pengetikan, perbaikan tata bahasa, atau penyesuaian kecil lainnya yang tidak
            memengaruhi struktur atau konten utama panduan.
          </li>
        </ul>

        <template #footer> </template>
      </Dialog>

      <label v-if="errorMessage?.version?.[0]" class="error-alert">
        {{ errorMessage.version[0] }}
      </label>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Kategori:</label>
        <Select
          v-model="selectedCategory"
          :options="categories"
          optionLabel="name"
          @change="handleCategoryChange"
          class="w-full border-grey-background rounded focus:outline-none focus:ring-2 focus:ring-soft-blue"
          placeholder="Pilih category"
          overlayClass="border-grey-background rounded p-2 focus:outline-none focus:ring-2 focus:ring-soft-blue"
        />
      </div>
      <label v-if="errorMessage?.category?.[0]" class="error-alert">
        {{ errorMessage.category[0] }}
      </label>

      <!-- Text Editor -->
      <div class="form-group">
        <label for="content">Konten:</label>
        <FormTextEditor :form="form" @update:form="updateForm" />
      </div>
      <label v-if="errorMessage?.content?.[0]" class="error-alert">
        {{ errorMessage.content[0] }}
      </label>

      <!-- Disclaimer -->
      <p class="disclaimer text-justify">
        *Harap dicatat bahwa semua kontribusi pada User Manual Wiki dapat diedit, diubah, atau
        dihapus oleh kontributor lain. Jika Anda tidak ingin tulisan Anda diedit tanpa ampun, jangan
        kirimkan di sini. Anda juga berjanji kepada kami bahwa Anda menulisnya sendiri, atau
        menyalinnya dari domain publik atau sumber gratis serupa. Jangan kirimkan karya berhak cipta
        tanpa izin!
      </p>

      <!-- Action Buttons -->
      <div class="form-actions">
        <RouterLink
          :to="form.user_manual_id ? `/main/user-manuals/${form.user_manual_id}` : '/main'"
        >
          <button type="button" class="cancel-button">Batal</button>
        </RouterLink>

        <!-- Conditionally render the ProgressSpinner or the Save button -->
        <button
          type="submit"
          :class="[
            'save-button',
            'duration-300',
            loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
          :disabled="loading"
        >
          <template v-if="loading">
            <ProgressSpinner
              style="width: 20px; height: 15px"
              strokeWidth="8"
              fill="transparent"
              animationDuration=".9s"
              aria-label="Custom ProgressSpinner"
            />
          </template>
          <template v-else>Simpan</template>
        </button>
      </div>

      <!-- <label v-if="errorMessage" class="text-red-custom">
        {{ errorMessage.title[0] }}
      </label> -->

      <PopUpSuccessful
        v-if="showSuccessPopup"
        title="Selamat!"
        message="Kamu berhasil membuat panduan baru"
        class="popup-center animate__animated animate__zoomIn"
      />
      <PopUpSuccessful
        v-if="showSuccessEditPopup"
        title="Keren!"
        message="Kamu berhasil mengedit panduan ini."
        class="popup-center animate__animated animate__zoomIn"
      />

      <PopUpUnsuccessfull
        v-if="showErrorPopup"
        title="Error!"
        :message="formattedMessage(errorMessage)"
        class="popup-center animate__animated animate__zoomIn"
      />
    </form>
    <!-- PopUp Successful -->
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { storeUserManual, updateUserManual } from '../services/modules/UserManualService'
import FormTextEditor from '../components/Form/FormTextEditor.vue'
import FormImageInput from '../components/Form/FormImageInput.vue'
import Select from 'primevue/select'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import PopUpSuccessful from '@/components/widgets/PopUpSuccessful.vue'
import PopUpUnsuccessfull from '@/components/widgets/PopUpUnsuccessfull.vue'
import { formattedMessage } from '@/helpers/FormattedMessageError'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'

// Define props
const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  isUpdate: Boolean
})

const visible = ref(false)

// Reactive form object
const form = ref(props.form)

// Watch for changes to props and update form
watchEffect(() => {
  form.value = { ...props.form }
})

// Get creator from localStorage and update form properties
const getCreator = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    form.value.initial_editor = user.name
    form.value.user_id = user.user_id
    return user.name // Ensure it returns the user's name
  }
  return '' // Ensure it returns an empty string if user is null
}

// Get creator from localStorage and update form properties
const getEditor = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    form.value.latest_editor = user.name
    form.value.user_id = user.user_id
    return user.name // Ensure it returns the user's name
  }
  return '' // Ensure it returns an empty string if user is null
}

// Compute the creator value
const creatorValue = computed(() => {
  return form.value.initial_editor || getCreator() // Use logical OR for simplicity
})

// Method to update the form
const updateForm = (updatedForm) => {
  form.value = { ...form.value, ...updatedForm } // Merge updated properties
}

// Watch the form object deeply
watch(
  () => form.value,
  () => {
    form.value.size = contentSize()
    // console.log(newValue) // Log the updated form value
  },
  { deep: true }
)

// Category
const categories = ref([{ name: 'Eksternal' }, { name: 'Internal' }])
const selectedCategory = ref('')

// Use watchEffect to automatically update selectedCategory based on form.value.category
watchEffect(() => {
  const categoryValue = form.value.category // Automatically tracks reactivity on form.value.category
  if (categoryValue) {
    const matchedCategory = categories.value.find(
      (cat) => cat.name.toLowerCase() === categoryValue.toLowerCase()
    )
    selectedCategory.value = matchedCategory ? matchedCategory : null
  }
})

const handleCategoryChange = (selectedOption) => {
  // console.log(selectedOption)
  form.value.category = selectedOption.value.name.toLowerCase() // Directly use the name property
}

// Method to update the image in the form
const updateImage = (newImage) => {
  // console.log(newImage)
  form.value.img = newImage // Update image property
}

// Error handle
const errorMessage = ref({})

const router = useRouter()
const showSuccessPopup = ref(false)
const showSuccessEditPopup = ref(false)
const showErrorPopup = ref(false)
const loading = ref(false) // Track if the form is submitting
const isLeave = ref(false)

onBeforeRouteLeave((to, from, next) => {
  // Show a confirmation dialog
  if (!isLeave.value) {
    const answer = confirm('Perubahan anda tidak akan disimpan')
    if (answer) {
      // Allow navigation
      next()
    } else {
      // Cancel navigation
      next(false)
    }
  }
  if (isLeave.value) {
    return next() // Proceed with the navigation
  }
})

// Handle form submission
const handleSubmit = async () => {
  loading.value = true // Show spinner when the form is being submitted

  try {
    console.log(form.value) // Log the form value

    let response = []
    if (!props.isUpdate) {
      response = await storeUserManual(form.value) // Call the store service
      if (response && response.status !== 201) {
        // Check for errors in response
        errorMessage.value = response.data.errors || ['Unknown error occurred'] // Assign error messages to errorMessage
        // Show PopUp
        showErrorPopup.value = true
        isLeave.value = true
        setTimeout(() => {
          isLeave.value = false
          showErrorPopup.value = false
        }, 3000)
      } else {
        errorMessage.value = [] // Clear error message if no error
        showSuccessPopup.value = true
        isLeave.value = true
        setTimeout(() => {
          showSuccessPopup.value = false
          router.push(`/main/user-manuals/${response.data.data.user_manual_id}`)
        }, 3000)
      }
    } else {
      response = await updateUserManual(form.value, form.value.user_manual_id)
      if (response.status === 400) {
        // Check for errors in response
        console.log(response)
        if (response.data.errors.title) {
          console.log('ini title')
          errorMessage.value.title = [response.data.errors.title]
        } else if (response.data.errors.version) {
          console.log('ini version')
          errorMessage.value.version = [response.data.errors.version]
        } else {
          errorMessage.value = response.data.errors
        }
        isLeave.value = true
        console.log(errorMessage.value.version)
        showErrorPopup.value = true
        setTimeout(() => {
          isLeave.value = false
          showErrorPopup.value = false
        }, 3000)
      } else {
        errorMessage.value = [] // Clear error message if no error
        showSuccessEditPopup.value = true
        isLeave.value = true
        setTimeout(() => {
          showSuccessEditPopup.value = false
          router.push(`/main/user-manuals/${response.data.data.user_manual_id}`)
        }, 3000)
      }
    }
  } catch (error) {
    console.error(error) // Log any errors
    errorMessage.value = ['An error occurred during submission.'] // Display general error message
    showErrorPopup.value = true
    setTimeout(() => {
      showErrorPopup.value = false
    }, 3000)
  } finally {
    loading.value = false // Hide spinner when submission is complete (either success or failure)
  }
}

// Count our content
const contentSize = () => {
  const byteSize = new Blob([form.value.content || '']).size // Calculate size in bytes
  const sizeInKB = byteSize / 1024 // Convert to KB
  const sizeInMB = sizeInKB / 1024 // Convert to MB

  if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(2)} MB` // Display size in MB if it's 1 MB or more
  } else {
    return `${sizeInKB.toFixed(2)} KB` // Otherwise, display size in KB
  }
}
</script>
