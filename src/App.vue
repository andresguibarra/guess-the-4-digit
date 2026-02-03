<template>
  <div class="container-sm">
    <LanguageSelector />
    <div class="row justify-content-md-center">
      <div class="col col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div class="game-card">
          <h1 class="text-center my-2">{{ t('title') }}</h1>
          <p class="text-center d-none d-sm-block mb-3">
            {{ t('description') }}
            <br />{{ t('attemptsText') }}
          </p>
          <table class="table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" class="guess-column">{{ t('guess') }}</th>
                <th scope="col" class="goods-column">
                  <Popper hover arrow>
                    <span class="d-flex align-items-center justify-content-center">
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
                    <span class="d-flex align-items-center justify-content-center">
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
                  <span v-if="attempts[index]?.guess" class="fade-in">{{
                    attempts[index]?.guess
                  }}</span>
                </td>
                <td>
                <span v-if="attempts[index]?.cows !== undefined" class="fade-in">{{
                  attempts[index]?.cows
                }}</span>
              </td>
              <td>
                <span v-if="attempts[index]?.bulls !== undefined" class="fade-in">{{
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
          <button @click="resetGame" class="btn btn-sm btn-outline-secondary ms-auto">
            {{ t('playAgain') }}
          </button>
        </div>
        <div v-else class="text-center my-3">
          <button @click="resetGame" class="btn btn-sm btn-outline-secondary">
            <RotateLeftIcon class="me-1" />
            {{ t('reset') }}
          </button>
        </div>
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

interface Attempt {
  guess: string
  cows: number
  bulls: number
}

const { t } = useTranslation()

const attempts: Ref<Attempt[]> = ref([])
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.container-sm {
  position: relative;
  padding: 1rem;
}

* {
  font-family: 'Inter', sans-serif;
}

/* Clean card design */
.game-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  margin-top: 1.5rem;
}

h1 {
  font-weight: 700;
  color: #1e293b;
  font-size: 1.5rem;
}

@media (min-width: 1200px) {
  h1 {
    font-size: 1.75rem;
  }
}

p {
  font-weight: 400;
  color: #64748b;
  font-size: 0.9rem;
}

/* Table styling */
table {
  margin-bottom: 1.5rem;
}

table th {
  font-weight: 600;
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f8fafc;
}

.table-hover > tbody > tr:hover {
  background-color: #f1f5f9;
}

.table-row td {
  vertical-align: middle;
  padding: 0.75rem;
}

.table-row td:first-child {
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.15rem;
  color: #1e293b;
  font-family: 'Monaco', 'Consolas', monospace;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.table-row > td:nth-child(2),
.table-row > td:nth-child(3) {
  text-align: center;
}

/* Score indicators */
.table-row > td:nth-child(2) span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  background: #fef3c7;
  border-radius: 6px;
  color: #b45309;
  font-weight: 600;
  font-size: 0.85rem;
}

.table-row > td:nth-child(3) span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  background: #dcfce7;
  border-radius: 6px;
  color: #15803d;
  font-weight: 600;
  font-size: 0.85rem;
}

.guess-column {
  width: 50%;
}

.goods-column,
.corrects-column {
  width: 25%;
  text-align: center;
}

.table-row {
  font-size: 0.875rem;
  height: 44px;
}

/* Input styling */
.form-control {
  border: 2px solid #e2e8f0;
  border-radius: 10px 0 0 10px;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  letter-spacing: 0.2rem;
  font-weight: 600;
  font-family: 'Monaco', 'Consolas', monospace;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: var(--game-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}

.form-control::placeholder {
  letter-spacing: 0;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  color: #94a3b8;
}

/* Submit button */
.btn-primary {
  background: var(--game-primary);
  border: none;
  border-radius: 0 10px 10px 0;
  padding: 0.75rem 1.25rem;
  transition: background 0.2s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--game-primary-dark);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-primary:disabled {
  background: #cbd5e1;
}

/* Numpad */
.num-pad {
  display: none;
  margin-top: 1rem;
}

.num-pad .btn {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.15s;
}

.num-pad .btn-outline-primary {
  border: 2px solid #e2e8f0;
  background: white;
  color: #1e293b;
}

.num-pad .btn-outline-primary:hover:not(:disabled) {
  background: var(--game-primary);
  border-color: var(--game-primary);
  color: white;
}

.num-pad .btn-outline-primary:active:not(:disabled) {
  transform: scale(0.95);
}

.num-pad .btn-outline-danger {
  border: 2px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
}

.num-pad .btn-outline-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}

@media (max-width: 768px) {
  .num-pad {
    display: block;
  }
}

/* Alert messages */
.alert {
  border-radius: 12px;
  padding: 1rem 1.25rem;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.alert-success {
  background: #dcfce7;
  color: #15803d;
}

.alert-danger {
  background: #fef2f2;
  color: #dc2626;
}

/* Secondary button */
.btn-outline-secondary {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  background: white;
  padding: 0.4rem 0.875rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-outline-secondary:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
}
</style>
