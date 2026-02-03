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
                      <div class="tooltip-content tooltip-goods">
                        <div class="tooltip-title">{{ t('goodsTitle') }}</div>
                        <div class="tooltip-description">{{ t('goodsTooltip') }}</div>
                        <div class="tooltip-example">
                          <div class="tooltip-example-label">{{ t('example') }}:</div>
                          <div class="tooltip-example-row">
                            <span class="tooltip-label">{{ t('secretLabel') }}:</span>
                            <span class="digit-box">5</span>
                            <span class="digit-box">2</span>
                            <span class="digit-box digit-highlight-good">7</span>
                            <span class="digit-box digit-highlight-good">4</span>
                          </div>
                          <div class="tooltip-example-row">
                            <span class="tooltip-label">{{ t('guessLabel') }}:</span>
                            <span class="digit-box digit-highlight-good">4</span>
                            <span class="digit-box digit-highlight-good">7</span>
                            <span class="digit-box">3</span>
                            <span class="digit-box">1</span>
                          </div>
                          <div class="tooltip-result">
                            <span class="result-badge result-goods">2 {{ t('goods') }}</span>
                            <span class="tooltip-hint">{{ t('goodsHint') }}</span>
                          </div>
                        </div>
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
                      <div class="tooltip-content tooltip-corrects">
                        <div class="tooltip-title">{{ t('correctsTitle') }}</div>
                        <div class="tooltip-description">{{ t('correctsTooltip') }}</div>
                        <div class="tooltip-example">
                          <div class="tooltip-example-label">{{ t('example') }}:</div>
                          <div class="tooltip-example-row">
                            <span class="tooltip-label">{{ t('secretLabel') }}:</span>
                            <span class="digit-box digit-highlight-correct">5</span>
                            <span class="digit-box">2</span>
                            <span class="digit-box digit-highlight-correct">7</span>
                            <span class="digit-box">4</span>
                          </div>
                          <div class="tooltip-example-row">
                            <span class="tooltip-label">{{ t('guessLabel') }}:</span>
                            <span class="digit-box digit-highlight-correct">5</span>
                            <span class="digit-box">9</span>
                            <span class="digit-box digit-highlight-correct">7</span>
                            <span class="digit-box">1</span>
                          </div>
                          <div class="tooltip-result">
                            <span class="result-badge result-corrects">2 {{ t('corrects') }}</span>
                            <span class="tooltip-hint">{{ t('correctsHint') }}</span>
                          </div>
                        </div>
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
                  <span v-else class="cell-placeholder">&nbsp;</span>
                </td>
                <td>
                <span 
                  v-if="attempts[index]?.cows !== undefined" 
                  :class="['fade-in', { 'value-zero': attempts[index]?.cows === 0 }]"
                >{{
                  attempts[index]?.cows
                }}</span>
                <span v-else class="badge-placeholder">&nbsp;</span>
              </td>
              <td>
                <span 
                  v-if="attempts[index]?.bulls !== undefined" 
                  :class="['fade-in', { 'value-zero': attempts[index]?.bulls === 0 }]"
                >{{
                  attempts[index]?.bulls
                }}</span>
                <span v-else class="badge-placeholder">&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
        <form v-if="!message.show" @submit.prevent="submitGuess" class="form-inline d-flex">
          <div class="terminal-input-wrapper">
            <div class="terminal-input-container" @click="focusInput">
              <div class="terminal-display">
                <span v-for="i in 4" :key="i" class="digit-slot">
                  <span v-if="guess[i-1]" class="digit-value">{{ guess[i-1] }}</span>
                  <span v-else-if="i === guess.length + 1" class="cursor">_</span>
                  <span v-else class="digit-placeholder">_</span>
                </span>
              </div>
            <input
              ref="hiddenInput"
              v-model="guess"
              type="text"
              pattern="^(?!.*(.).*\1)[1-9]{1,4}$"
              maxlength="4"
              required
              class="hidden-input"
              :disabled="attempts.length === 10 || message.show"
              @input="validateInput"
              :readonly="isMobile()"
            />
              <button :disabled="guess.length < 4" type="submit" class="btn-submit">
                <PaperPlaneIcon />
              </button>
            </div>
            <transition name="tooltip-fade">
              <div v-if="errorTooltip.show" class="error-tooltip">
                {{ errorTooltip.text }}
              </div>
            </transition>
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
        <div v-else class="reset-container text-center my-3">
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
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
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
const hiddenInput = ref<HTMLInputElement | null>(null)
const errorTooltip = ref({
  show: false,
  text: ''
})
let errorTimeout: ReturnType<typeof setTimeout> | null = null
const message = ref({
  show: false,
  text: '',
  variant: ''
})

const showErrorTooltip = (text: string) => {
  if (errorTimeout) clearTimeout(errorTimeout)
  errorTooltip.value = { show: true, text }
  errorTimeout = setTimeout(() => {
    errorTooltip.value.show = false
  }, 1500)
}

const focusInput = () => {
  hiddenInput.value?.focus()
}

const isMobile = () => {
  return window.innerWidth <= 768
}

const appendToInput = (n: number) => {
  if (guess.value.length >= 4) return
  if (guess.value.includes(n.toString())) {
    showErrorTooltip(t('duplicateDigitError', n.toString()))
    return
  }
  guess.value += n.toString()
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
  // Solo permitir números del 1-9
  const validValue = currentValue.replace(/[^1-9]/g, '')

  // Actualizar el v-model con el valor filtrado
  guess.value = validValue

  if (currentValue !== validValue) {
    inputElement.setCustomValidity(t('invalidDigits'))
  } else if (hasDuplicates(validValue)) {
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

// Capturar teclas globalmente
const handleGlobalKeydown = (e: KeyboardEvent) => {
  // Si el juego terminó, no hacer nada
  if (message.value.show || attempts.value.length >= 10) return
  
  // Si es un número del 1-9
  if (/^[1-9]$/.test(e.key)) {
    e.preventDefault()
    if (guess.value.length >= 4) return
    if (guess.value.includes(e.key)) {
      showErrorTooltip(t('duplicateDigitError', e.key))
      return
    }
    guess.value += e.key
  }
  
  // Backspace para borrar
  if (e.key === 'Backspace') {
    e.preventDefault()
    guess.value = guess.value.slice(0, -1)
  }
  
  // Enter para enviar
  if (e.key === 'Enter' && guess.value.length === 4) {
    e.preventDefault()
    submitGuess()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

secretNumber.value = generateSecretNumber()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

.container-sm {
  position: relative;
  padding: 1rem;
  min-height: 100vh;
}

/* Subtle grid background */
.container-sm::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: -1;
}

* {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
}

/* Card design */
.game-card {
  background: rgba(21, 27, 35, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent);
}

h1 {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  color: #fff;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
}

@media (min-width: 1200px) {
  h1 {
    font-size: 1.75rem;
  }
}

p {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Table styling - force dark theme */
table.table {
  margin-bottom: 1.5rem;
  border-collapse: separate;
  border-spacing: 0;
  background: transparent !important;
  --bs-table-bg: transparent;
  --bs-table-striped-bg: rgba(255, 255, 255, 0.03);
  --bs-table-hover-bg: rgba(255, 255, 255, 0.06);
  --bs-table-color: rgba(255, 255, 255, 0.9);
}

table.table th {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5) !important;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: transparent !important;
}

table.table tbody {
  background: transparent !important;
}

table.table tbody tr {
  background: transparent !important;
}

table.table > tbody > tr:nth-of-type(odd) > * {
  background-color: rgba(255, 255, 255, 0.03) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

table.table > tbody > tr:nth-of-type(even) > * {
  background-color: transparent !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

table.table > tbody > tr:hover > * {
  background-color: rgba(255, 255, 255, 0.06) !important;
}

.table-row td {
  vertical-align: middle;
  padding: 0.6rem 0.75rem;
  border: none !important;
  background: transparent;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Digit display for guesses */
.table-row td:first-child {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 1.3rem;
  letter-spacing: 0.4rem;
  color: rgba(255, 255, 255, 0.9);
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
  min-width: 40px;
  height: 32px;
  padding: 0 12px;
  background: var(--game-warning-muted);
  border: 1px solid rgba(251, 146, 60, 0.3);
  border-radius: 8px;
  color: #fb923c;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1rem;
}

.table-row > td:nth-child(2) span.value-zero {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.25);
}

.table-row > td:nth-child(3) span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 32px;
  padding: 0 12px;
  background: var(--game-success-muted);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 8px;
  color: #4ade80;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1rem;
}

.table-row > td:nth-child(3) span.value-zero {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.25);
}

/* Placeholder elements for empty cells to maintain consistent row heights */
.cell-placeholder {
  display: inline-block;
  /* Matches the font-size of guess digits (1.3rem) */
  height: 1.3rem;
  visibility: hidden;
}

.badge-placeholder {
  display: inline-block;
  min-width: 40px;
  /* Matches the score badge height */
  height: 32px;
  visibility: hidden;
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
  height: 48px;
}

/* Input styling */
.input-group {
  position: relative;
}

/* Terminal Input Styling */
.terminal-input-wrapper {
  position: relative;
  width: 100%;
}

.terminal-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: 2px solid #333;
  border-radius: 0;
  overflow: hidden;
}

.terminal-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
  background: transparent;
  cursor: text;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.digit-slot {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 2rem;
  min-width: 1.5rem;
  text-align: center;
}

.digit-value {
  color: #fff;
}

.digit-placeholder {
  color: rgba(255, 255, 255, 0.15);
}

.cursor {
  color: #fff;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Error tooltip */
.error-tooltip {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(248, 113, 113, 0.95);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.error-tooltip::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(248, 113, 113, 0.95);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}

.btn-submit {
  background: transparent;
  border: none;
  border-left: 2px solid #333;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-submit svg {
  color: rgba(255, 255, 255, 0.5);
  width: 24px;
  height: 24px;
  transition: color 0.2s;
}

.btn-submit:hover:not(:disabled) svg {
  color: #fff;
}

.btn-submit:disabled {
  cursor: not-allowed;
}

.btn-submit:disabled svg {
  color: rgba(255, 255, 255, 0.2);
}

.form-control {
  background: rgba(15, 20, 25, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 12px 0 0 12px;
  padding: 0.875rem 1rem;
  font-size: 1.1rem;
  letter-spacing: 0.15rem;
  font-weight: 600;
  font-family: 'Roboto', monospace;
  color: #fff;
  transition: all 0.2s;
}

.form-control:focus {
  background: rgba(15, 20, 25, 1);
  border-color: var(--game-primary);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
  outline: none;
}

.form-control::placeholder {
  letter-spacing: 0;
  font-weight: 400;
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.3);
}

/* Submit button */
.btn-primary {
  background: var(--game-primary);
  border: none;
  border-radius: 0 12px 12px 0;
  padding: 0.875rem 1.25rem;
  transition: all 0.2s;
}

.btn-primary svg {
  color: #0f1419;
}

.btn-primary:hover:not(:disabled) {
  background: var(--game-primary-dark);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-primary:disabled {
  background: rgba(56, 189, 248, 0.3);
  opacity: 0.6;
}

/* Numpad */
.num-pad {
  display: none;
  margin-top: 1.25rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.num-pad .btn {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  transition: all 0.15s;
}

.num-pad .btn-outline-primary {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.num-pad .btn-outline-primary:hover:not(:disabled) {
  background: var(--game-primary);
  border-color: var(--game-primary);
  color: #0f1419;
}

.num-pad .btn-outline-primary:active:not(:disabled) {
  transform: scale(0.95);
}

.num-pad .btn-outline-danger {
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
}

.num-pad .btn-outline-danger:hover:not(:disabled) {
  background: #f87171;
  border-color: #f87171;
  color: #fff;
}

@media (max-width: 768px) {
  .num-pad {
    display: block;
  }

  /* Mobile viewport fix - max height 100dvh, content fills available space */
  .container-sm {
    padding: 0.5rem;
    height: 100vh; /* Fallback for browsers that don't support dvh */
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .row {
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .col {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .game-card {
    margin-top: 0.5rem;
    padding: 0.75rem;
    border-radius: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  h1 {
    font-size: 1.3rem;
    margin-bottom: 0.25rem !important;
    margin-top: 0 !important;
  }

  /* Table expands to fill available space */
  table.table {
    margin-bottom: 0.5rem;
    flex: 1;
    min-height: 0;
  }

  table.table th {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }

  /* Table rows fill available space proportionally */
  .table-row {
    height: auto;
  }

  .table-row td {
    padding: 0.35rem 0.5rem;
    font-size: 0.85rem;
  }

  .table-row td:first-child {
    font-size: 1rem;
    letter-spacing: 0.25rem;
  }

  .table-row > td:nth-child(2) span,
  .table-row > td:nth-child(3) span {
    min-width: 28px;
    height: 24px;
    padding: 0 8px;
    font-size: 0.8rem;
  }

  /* Mobile placeholder heights */
  .cell-placeholder {
    height: 1rem;
  }

  .badge-placeholder {
    min-width: 28px;
    height: 24px;
  }

  /* Terminal input */
  .terminal-input-wrapper {
    margin-bottom: 0.25rem;
    flex-shrink: 0;
  }

  .terminal-display {
    padding: 0.5rem 1rem;
    gap: 0.3rem;
  }

  .digit-slot {
    font-size: 1.5rem;
    min-width: 1.25rem;
  }

  .btn-submit {
    padding: 0.5rem 1rem;
  }

  .btn-submit svg {
    width: 20px;
    height: 20px;
  }

  /* Numpad - fixed size, doesn't shrink */
  .num-pad {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .num-pad .d-flex {
    margin-top: 0.25rem !important;
    margin-bottom: 0.25rem !important;
  }

  .num-pad .btn {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    font-size: 1rem;
  }

  /* Reset button */
  .reset-container {
    margin-top: 0.5rem !important;
    margin-bottom: 0.25rem !important;
    flex-shrink: 0;
  }

  .btn-outline-secondary {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }

  /* Alert message */
  .alert {
    padding: 0.75rem 1rem;
    margin-top: 0.5rem !important;
    font-size: 0.9rem;
    gap: 0.5rem;
    flex-shrink: 0;
  }
}

/* Alert messages */
.alert {
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  border: 2px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 1.1rem;
  background: transparent;
  text-align: center;
}

.alert-success {
  border-color: rgba(74, 222, 128, 0.5);
  color: #4ade80;
}

.alert-danger {
  border-color: rgba(248, 113, 113, 0.5);
  color: #f87171;
}

.alert .btn-outline-secondary {
  margin-top: 0.5rem;
}

/* Secondary button - Reset */
.btn-outline-secondary {
  border: 2px solid #333;
  border-radius: 0;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  padding: 0.6rem 1.25rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.btn-outline-secondary svg {
  color: rgba(255, 255, 255, 0.6);
}

/* Tooltip styling */
.tooltip-content {
  padding: 0.875rem;
  max-width: 280px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
}

.tooltip-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tooltip-goods .tooltip-title {
  color: #fb923c;
}

.tooltip-corrects .tooltip-title {
  color: #4ade80;
}

.tooltip-description {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.tooltip-example {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tooltip-example-label {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tooltip-example-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.4rem;
}

.tooltip-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  width: 55px;
  flex-shrink: 0;
}

.digit-box {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'JetBrains Mono', monospace;
}

.digit-highlight-good {
  background: var(--game-warning-muted);
  border-color: rgba(251, 146, 60, 0.4);
  color: #fb923c;
}

.digit-highlight-correct {
  background: var(--game-success-muted);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ade80;
}

.tooltip-result {
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  width: fit-content;
}

.result-goods {
  background: var(--game-warning-muted);
  color: #fb923c;
}

.result-corrects {
  background: var(--game-success-muted);
  color: #4ade80;
}

.tooltip-hint {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
  line-height: 1.3;
}

/* Popper arrow styling */
:root {
  --popper-theme-background-color: rgba(21, 27, 35, 0.98);
  --popper-theme-background-color-hover: rgba(21, 27, 35, 0.98);
  --popper-theme-text-color: white;
  --popper-theme-border-width: 1px;
  --popper-theme-border-color: rgba(255, 255, 255, 0.1);
  --popper-theme-border-radius: 12px;
  --popper-theme-padding: 0;
  --popper-theme-box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Info icon color */
.goods-column svg,
.corrects-column svg {
  color: rgba(255, 255, 255, 0.4);
  width: 14px;
  height: 14px;
}
</style>
