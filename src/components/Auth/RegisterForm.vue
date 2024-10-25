<template>
  <div class="w-[35%] relative h-full">
    <transition name="slide" mode="out-in" class="h-full">
      <section v-if="currentSlide === 1" :key="1">
        <div
          class="text-soft-blue text-2xl mb-2 font-semibold w-fit flex flex-col justify-center gap-4"
        >
          <h1>Create Account <span @click="handleNext()">(Step 1 of 2)</span></h1>
          <div class="flex justify-center items-center w-full gap-2">
            <div class="border-gradient w-full h-1"></div>
            <div class="border-grey w-full h-1 cursor-pointer" @click="handleNext()"></div>
          </div>
        </div>

        <form @submit.prevent="handleNext" class="flex flex-col gap-2">
          <div>
            <label>Username <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="username"
                v-model="input.username"
                type="text"
                placeholder="Enter your username"
                @focus="clearError"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.username?.[0]" :class="[errorStyle()]">{{
              errors?.username[0]
            }}</label>
          </div>
          <div>
            <label>Password <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="password"
                v-model="input.password"
                type="password"
                placeholder="Enter your password"
                @focus="clearError"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.password?.[0]" :class="[errorStyle()]">{{
              errors.password[0]
            }}</label>
          </div>
          <div>
            <label>Confirm Password <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="confirmPassword"
                v-model="input.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                @focus="clearError"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.confirmPassword?.[0]" :class="[errorStyle()]">{{
              errors.confirmPassword[0]
            }}</label>
          </div>
          <button
            type="submit"
            class="absolute bottom-[5%] bg-dark-blue text-white-background p-3 rounded-xl mt-5 w-full"
          >
            Next
          </button>
        </form>
      </section>
      <section v-else-if="currentSlide === 2" :key="2">
        <div
          class="text-soft-blue text-2xl mb-2 font-semibold w-fit flex flex-col justify-center gap-4"
        >
          <h1>Create Account <span @click="handleNext()">(Step 2 of 2)</span></h1>
          <div class="flex justify-center items-center w-full gap-2">
            <div class="border-grey w-full h-1 cursor-pointer" @click="handleNext()"></div>
            <div class="border-gradient w-full h-1"></div>
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
          <div>
            <label>Email Address <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="email"
                v-model="input.email"
                type="email"
                placeholder="Enter your email address"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.email?.[0]" :class="[errorStyle()]">{{ errors.email[0] }}</label>
          </div>
          <div>
            <label>Real Name <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="name"
                v-model="input.name"
                type="text"
                placeholder="Enter your name"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.name?.[0]" :class="[errorStyle()]">{{ errors.name[0] }}</label>
          </div>
          <button
            type="submit"
            class="absolute bottom-[5%] bg-dark-blue text-white-background p-3 rounded-xl w-full"
          >
            Create Account
          </button>
        </form>
      </section>
    </transition>
  </div>
</template>

<script setup>
import { userRegister } from '@/services/modules/AuthService'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const input = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  name: ''
})

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  email: null,
  name: null
})

const inputStyle = () => {
  return 'border-gradient-inner focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent w-full'
}

const errorStyle = () => {
  return 'text-red-custom'
}

const router = useRouter()
const currentSlide = ref(1)

const handleSubmit = async () => {
  errors.value = {}

  if (input.value.password !== input.value.confirmPassword) {
    errors.value.confirmPassword = ['Passwords do not match']
    return
  }

  try {
    const response = await userRegister(input.value)

    if (response.status === 400 && response.data?.errors) {
      errors.value = response.data.errors
      console.log(errors.value)
      return
    }
    console.log(response)
    router.push('/login')
    errors.value = {}
    console.log('Account successfully created')
  } catch (err) {
    console.error('Error while registering:', err)
  }
}

const handleNext = () => {
  if (input.value.password !== input.value.confirmPassword) {
    errors.value.confirmPassword = ['Passwords do not match']
    return
  }
  if (currentSlide.value == 2) {
    currentSlide.value = 1
  } else {
    currentSlide.value = 2
  }
}

const clearError = () => {
  errors.value = {}
}
</script>

<style scoped>
/* Slide Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Ensure content doesn't jump during transition */
section {
  position: absolute;
  width: 100%;
}
</style>
