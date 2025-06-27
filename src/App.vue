<template>
  <div class="container-sm">
    <LanguageSelector />
    <div class="row justify-content-md-center">
      <div class="col col-sm-6 col-md-6 col-lg-4 col-xl-3">
        <h1 class="text-center my-2">{{ t('title') }}</h1>
        <p class="text-center d-none d-sm-block">
          {{ t('description') }}
          <br />{{ t('attemptsText') }}
        </p>
        <table class="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th scope="col" class="guess-column">{{ t('guess') }}</th>
              <th scope="col" class="goods-column">
                <Popper hover arrow>
                  <span class="d-flex align-items-center">
                    <span class="me-1">{{ t('goods') }}</span>
                    <CircleInfo />
                  </span>
                  <template #content>
                    <div style="white-space: nowrap">
                      {{ t('goodsTooltip') }}
                    </div>
                  </template>
                </Popper>
              </th>
              <th scope="col" class="corrects-column">
                <Popper hover arrow>
                  <span class="d-flex align-items-center">
                    <span class="me-1">{{ t('corrects') }}</span>
                    <CircleInfo />
                  </span>
                  <template #content>
                    <div style="white-space: nowrap">
                      {{ t('correctsTooltip') }}
                    </div>
                  </template>
                </Popper>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attempt, index) in Array(10)" :key="index" class="table-row">
              <td>
                <span v-if="attempts[index]?.guess" class="fade-in fade-out">{{
                  attempts[index]?.guess
                }}</span>
              </td>
              <td>
                <span v-if="attempts[index]?.cows !== undefined" class="fade-in fade-out">{{
                  attempts[index]?.cows
                }}</span>
              </td>
              <td>
                <span v-if="attempts[index]?.bulls !== undefined" class="fade-in fade-out">{{
                  attempts[index]?.bulls
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <form v-if="!message.show" @submit.prevent="submitGuess" class="form-inline d-flex">
          <div class="input-group">
            <input
              v-model="guess"
              type="text"
              pattern="^(?!.*(.).*\1)[1-9]{1,4}$"
              maxlength="4"
              :placeholder="t('inputPlaceholder')"
              required
              class="form-control"
              :disabled="attempts.length === 10 || message.show"
              @input="validateInput"
              :readonly="isMobile()"
            />
            <button :disabled="guess.length < 4" type="submit" class="btn btn-primary ml-2"><PaperPlaneIcon /></button>
          </div>
        </form>
        <div v-if="!message.show" class="num-pad">
          <div class="d-flex justify-content-around my-3">
            <button
              v-for="n in 5"
              :key="n"
              @click="appendToInput(n)"
              class="btn btn-outline-primary"
              :disabled="attempts.length === 10 || message.show"
            >
              {{ n }}
            </button>
          </div>
          <div class="d-flex justify-content-around my-3">
            <button
              v-for="n in 4"
              :key="n + 5"
              @click="appendToInput(n + 5)"
              class="btn btn-outline-primary"
              :disabled="attempts.length === 10 || message.show"
            >
              {{ n + 5 }}
            </button>
            <button
              @click="removeFromInput"
              class="btn btn-outline-danger"
              :disabled="attempts.length === 10 || message.show"
            >
              &times;
            </button>
          </div>
        </div>

        <div
          v-if="message.show"
          :class="['alert', `alert-${message.variant}`, 'mt-3']"
          role="alert"
        >
          {{ message.text }}
          <button @click="resetGame" class="btn btn-sm btn-outline-secondary ml-2">
            {{ t('playAgain') }}
          </button>
        </div>
        <div v-else class="text-center my-4">
          <button @click="resetGame" class="btn btn-sm btn-outline-secondary ml-2">
            <RotateLeftIcon class="me-1" />
            {{ t('reset') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import Popper from 'vue3-popper'
import CircleInfo from './components/icons/CircleInfo.vue'
import PaperPlaneIcon from './components/icons/PaperPlaneIcon.vue'
import RotateLeftIcon from './components/icons/RotateLeftIcon.vue'
import LanguageSelector from './components/LanguageSelector.vue'
import { useTranslation } from './composables/useTranslation'

const { t } = useTranslation()

const attempts: Ref<any[]> = ref([])
const secretNumber = ref('')
const guess = ref('')
const message = ref({
  show: false,
  text: '',
  variant: ''
})

const isMobile = () => {
  return window.innerWidth <= 768
}

const appendToInput = (n: number) => {
  if (guess.value.length < 4 && !guess.value.includes(n.toString())) {
    guess.value += n.toString()
  }
}

const removeFromInput = () => {
  guess.value = guess.value.slice(0, -1)
}

const generateSecretNumber = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let secret = ''
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length)
    secret += numbers[randomIndex]
    numbers.splice(randomIndex, 1)
  }
  return secret
}

const validateInput = (e: Event) => {
  const inputElement = e.target as HTMLInputElement
  const currentValue = inputElement.value
  const validValue = currentValue.replace(/[^1-9]/g, '')

  if (currentValue !== validValue) {
    inputElement.value = validValue
    inputElement.setCustomValidity(t('invalidDigits'))
  } else if (hasDuplicates(currentValue)) {
    inputElement.setCustomValidity(t('duplicateDigits'))
  } else {
    inputElement.setCustomValidity('')
  }
}

const hasDuplicates = (value: string) => {
  const digits = value.split('')
  return digits.some((digit, index) => digits.indexOf(digit) !== index)
}

const submitGuess = () => {
  if (attempts.value.length < 10) {
    const { bulls, cows } = calculateBullsAndCows(guess.value)
    attempts.value.push({
      guess: guess.value,
      cows,
      bulls
    })

    if (bulls === 4) {
      message.value = {
        show: true,
        text: t('winMessage', secretNumber.value),
        variant: 'success'
      }
    } else if (attempts.value.length === 10) {
      message.value = {
        show: true,
        text: t('loseMessage', secretNumber.value),
        variant: 'danger'
      }
    }
  }

  guess.value = ''
}

const calculateBullsAndCows = (guess: string) => {
  let bulls = 0
  let cows = 0

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretNumber.value[i]) {
      bulls++
    }
    if (secretNumber.value.includes(guess[i])) {
      cows++
    }
  }

  return { bulls, cows }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetGame = () => {
  attempts.value = []
  secretNumber.value = generateSecretNumber()
  message.value = {
    show: false,
    text: '',
    variant: ''
  }
  scrollToTop()
}

secretNumber.value = generateSecretNumber()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

.container-sm {
  position: relative;
}

* {
  font-family: 'Roboto', sans-serif;
}
h1 {
  font-weight: 500;
  color: #2c3e50;
}
@media (min-width: 1200px) {
  h1 {
    font-size: 2rem !important;
  }
}

p {
  font-weight: 400;
  color: #2c3e50;
}

table {
  margin-bottom: 30px;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.2s ease-in forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

table th {
  font-weight: 500;
}

.table-row > td:first-child {
  letter-spacing: 0.01rem;
}
.table-row > td:nth-child(2),
.table-row > td:nth-child(3) {
  text-align: center;
}

.guess-column {
  width: 80%;
}

.goods-column,
.corrects-column {
  width: 10%;
  text-align: center;
}

.table-row {
  font-size: 0.75rem;
  height: 36px;
}

.num-pad {
  display: none;
}

@media (max-width: 768px) {
  .num-pad {
    display: block;
  }
}
</style>
