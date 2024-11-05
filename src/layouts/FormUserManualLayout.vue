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
          placeholder="Enter title"
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
          placeholder="Enter Deskripsi Singkat"
          class="input-field"
        />
      </div>
      <label v-if="errorMessage?.short_desc?.[0]" class="error-alert">
        {{ errorMessage.short_desc[0] }}
      </label>

      <!-- Creator -->
      <div class="form-group">
        <label for="creator">Creator:</label>
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
        <label for="creator">Editor:</label>
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
      <div class="form-group">
        <label for="version">Version:</label>
        <input
          type="text"
          id="version"
          v-model="form.version"
          placeholder="Enter version"
          class="input-field"
        />
      </div>
      <label v-if="errorMessage?.version?.[0]" class="error-alert">
        {{ errorMessage.version[0] }}
      </label>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category:</label>
        <Select
          v-model="selectedCategory"
          :options="categories"
          optionLabel="name"
          @change="handleCategoryChange"
          class="w-full border-grey-background rounded focus:outline-none focus:ring-2 focus:ring-soft-blue"
          placeholder="Select a category"
          overlayClass="border-grey-background rounded p-2 focus:outline-none focus:ring-2 focus:ring-soft-blue"
        />
      </div>
      <label v-if="errorMessage?.category?.[0]" class="error-alert">
        {{ errorMessage.category[0] }}
      </label>

      <!-- Text Editor -->
      <div class="form-group">
        <label for="content">Isi:</label>
        <FormTextEditor :form="form" @update:form="updateForm" />
      </div>
      <label v-if="errorMessage?.content?.[0]" class="error-alert">
        {{ errorMessage.content[0] }}
      </label>

      <!-- Disclaimer -->
      <p class="disclaimer">
        *Please note that all contributions to usermanualwiki may be edited, altered, or removed by
        other contributors. If you do not want your writing to be edited mercilessly, then do not
        submit it here. You are also promising us that you wrote this yourself, or copied it from a
        public domain or similar free resource (Read Usermanualwiki: Copyrights for details). Do not
        submit copyrighted work without permission!
      </p>

      <!-- Action Buttons -->
      <div class="form-actions">
        <RouterLink
          :to="form.user_manual_id ? `/main/user-manuals/${form.user_manual_id}` : '/main'"
        >
          <button type="button" class="cancel-button">Cancel</button>
        </RouterLink>

        <button type="submit" class="save-button">Save</button>
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
import { useRouter } from 'vue-router'
import PopUpSuccessful from '@/components/widgets/PopUpSuccessful.vue'
import PopUpUnsuccessfull from '@/components/widgets/PopUpUnsuccessfull.vue'
import { formattedMessage } from '@/helpers/FormattedMessageError'

// Define props
const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  isUpdate: Boolean
})

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

// Handle form submission
const handleSubmit = async () => {
  console.log(form.value) // Log the form value

  let response = []
  if (!props.isUpdate) {
    response = await storeUserManual(form.value) // Call the store service
    if (response && response.status !== 201) {
      // Check for errors in response
      errorMessage.value = response.data.errors || ['Unknown error occurred'] // Assign error messages to errorMessage
      // Show PopUp
      showErrorPopup.value = true
      errorMessage.value = response.data.errors || ['Unknown error occurred']
      console.log(errorMessage.value)
      setTimeout(() => {
        showErrorPopup.value = false
      }, 3000)
    } else {
      errorMessage.value = [] // Clear error message if no error
      showSuccessPopup.value = true
      setTimeout(() => {
        showSuccessPopup.value = false
        router.push(`/main/user-manuals/${response.data.data.user_manual_id}`)
      }, 3000)
    }
  } else {
    response = await updateUserManual(form.value, form.value.user_manual_id)
    if (response && response.status !== 200) {
      // Check for errors in response
      console.log(response)
      errorMessage.value.version = [response.data.errors || ['Unknown error occurred']] // Assign error messages to errorMessage

      console.log(errorMessage.value.version)
      showErrorPopup.value = true
      setTimeout(() => {
        showErrorPopup.value = false
      }, 3000)
    } else {
      errorMessage.value = [] // Clear error message if no error
      showSuccessEditPopup.value = true
      setTimeout(() => {
        showSuccessEditPopup.value = false
        router.push(`/main/user-manuals/${response.data.data.user_manual_id}`)
      }, 3000)
    }
  }
  console.log(response) // Log the response
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
<style scoped>
.popup-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* pastikan z-index lebih tinggi dari elemen lain */
  animation: scale-in-center 0.4s ease-out;
}

@keyframes scale-in-center {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* Container for the entire form */
.form-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  margin: auto;
  border: 1px solid #7a7a7a; /* Complete border declaration */
}

/* Layout of the form items */
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Adds space between form groups */
}

/* Individual form group */
.form-group {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 20px;
}

/* Labels for form fields */
.form-group label {
  font-size: 16px;
  font-weight: 500;
  width: 100px; /* Fixed width for label alignment */
}

/* Input fields */
.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.border-field {
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Cover image preview */
.cover-preview {
  width: 80px; /* Adjusts the size of the preview */
  height: 80px;
  border-radius: 6px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover; /* Ensures the image fits well */
}

/* Upload button */
.upload-button {
  background-color: #ccc;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  font-weight: bold;
}

/* Styling for the rich text editor */
.text-editor {
  width: 100%;
  height: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
}

/* Disclaimer text at the bottom of the form */
.disclaimer {
  font-size: 12px;
  color: #555;
  line-height: 1.5;
  margin-top: 20px;
}

/* Form action buttons (cancel and save) */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Cancel button */
.cancel-button {
  background-color: #ccc;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  border: none;
}

/* Save button */
.save-button {
  background-color: #0056d2;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  font-weight: bold;
}

.error-alert {
  color: red;
  padding-left: 109px;
  font-size: small;
  font-style: italic;
}
</style>
