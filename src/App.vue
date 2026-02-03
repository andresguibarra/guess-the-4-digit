<template>
  <div class="container-sm">
    <LanguageSelector />
    <div class="row justify-content-md-center">
      <div class="col col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div class="game-card">
          <span class="emoji-decoration emoji-top-left">🎯</span>
          <span class="emoji-decoration emoji-top-right">🔢</span>
          <span class="emoji-decoration emoji-bottom-left">🎲</span>
          <span class="emoji-decoration emoji-bottom-right">🏆</span>
          
          <h1 class="text-center my-2">{{ t('title') }}</h1>
          <p class="text-center d-none d-sm-block mb-4">
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
            <span v-if="message.variant === 'success'" class="me-2">🎉</span>
            <span v-else class="me-2">😢</span>
            {{ message.text }}
            <button @click="resetGame" class="btn btn-sm btn-outline-secondary ms-3">
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
    
    <!-- Confetti container for winning -->
    <div v-if="showConfetti" class="confetti-container">
      <div 
        v-for="piece in confettiPieces" 
        :key="piece.id" 
        class="confetti"
        :style="{
          left: piece.left,
          backgroundColor: piece.backgroundColor,
          animationDelay: piece.animationDelay,
          borderRadius: piece.borderRadius
        }"
      ></div>
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

interface ConfettiPiece {
  id: number
  left: string
  backgroundColor: string
  animationDelay: string
  borderRadius: string
}

const { t } = useTranslation()

const attempts: Ref<Attempt[]> = ref([])
const secretNumber = ref('')
const guess = ref('')
const showConfetti = ref(false)
const confettiPieces: Ref<ConfettiPiece[]> = ref([])
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

const generateConfettiPieces = (): ConfettiPiece[] => {
  const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#f093fb']
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDelay: Math.random() * 0.5 + 's',
    borderRadius: Math.random() > 0.5 ? '50%' : '0'
  }))
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
      confettiPieces.value = generateConfettiPieces()
      showConfetti.value = true
      setTimeout(() => {
        showConfetti.value = false
        confettiPieces.value = []
      }, 3000)
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.container-sm {
  position: relative;
  z-index: 1;
}

* {
  font-family: 'Poppins', sans-serif;
}

/* Glassmorphism card */
.game-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  animation: cardAppear 0.6s ease-out;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

h1 {
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.75rem !important;
  text-shadow: none;
}

@media (min-width: 1200px) {
  h1 {
    font-size: 2rem !important;
  }
}

p {
  font-weight: 400;
  color: #64748b;
}

/* Modern table styling */
table {
  margin-bottom: 20px;
  border-collapse: separate;
  border-spacing: 0 8px;
}

table th {
  font-weight: 600;
  color: #475569;
  border: none !important;
  background: transparent !important;
  padding: 0.5rem 1rem;
}

.table-striped > tbody > tr {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
}

.table-striped > tbody > tr:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  transform: scale(1.02);
}

.table-row td {
  border: none !important;
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

.table-row td:first-child {
  border-radius: 12px 0 0 12px;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.2rem;
  color: #6366f1;
}

.table-row td:last-child {
  border-radius: 0 12px 12px 0;
}

.fade-in {
  opacity: 0;
  animation: fadeInBounce 0.4s ease-out forwards;
}

@keyframes fadeInBounce {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.table-row > td:nth-child(2),
.table-row > td:nth-child(3) {
  text-align: center;
  font-weight: 600;
}

.table-row > td:nth-child(2) span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  color: white;
  font-size: 0.85rem;
}

.table-row > td:nth-child(3) span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  color: white;
  font-size: 0.85rem;
}

.guess-column {
  width: 60%;
}

.goods-column,
.corrects-column {
  width: 20%;
  text-align: center;
}

.table-row {
  font-size: 0.875rem;
  height: 44px;
}

/* Modern input styling */
.form-control {
  border: 2px solid #e2e8f0;
  border-radius: 12px 0 0 12px;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  letter-spacing: 0.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-control:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  outline: none;
}

.form-control::placeholder {
  letter-spacing: 0;
  font-weight: 400;
  color: #94a3b8;
}

/* Submit button */
.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  box-shadow: none;
}

/* Numpad styling */
.num-pad {
  display: none;
}

.num-pad .btn {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.num-pad .btn-outline-primary {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #6366f1;
  border: 2px solid transparent;
}

.num-pad .btn-outline-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.num-pad .btn-outline-primary:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
}

.num-pad .btn-outline-danger {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #ef4444;
}

.num-pad .btn-outline-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
  .num-pad {
    display: block;
  }
}

/* Alert messages */
.alert {
  border-radius: 16px;
  padding: 1.25rem;
  border: none;
  animation: alertAppear 0.5s ease-out;
}

@keyframes alertAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

.alert-danger {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

/* Secondary button */
.btn-outline-secondary {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

/* Confetti animation for winning */
@keyframes confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-500px) rotate(720deg); opacity: 0; }
}

.confetti-container {
  position: fixed;
  top: 100%;
  left: 0;
  right: 0;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti 3s ease-out forwards;
}

/* Pulse animation for buttons - only on hover/focus for better performance */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.btn-primary:not(:disabled):hover,
.btn-primary:not(:disabled):focus {
  animation: pulse 1.5s ease-out;
}

/* Emoji decorations */
.emoji-decoration {
  position: absolute;
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
  opacity: 0.6;
}

.emoji-top-left {
  top: -10px;
  left: -10px;
  animation-delay: 0s;
}

.emoji-top-right {
  top: -10px;
  right: -10px;
  animation-delay: 0.5s;
}

.emoji-bottom-left {
  bottom: -10px;
  left: -10px;
  animation-delay: 1s;
}

.emoji-bottom-right {
  bottom: -10px;
  right: -10px;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}
</style>
