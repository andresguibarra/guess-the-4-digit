<template>
  <div class="relative p-4 min-h-screen grid-background md:p-1 md:h-dvh md:flex md:flex-col md:overflow-hidden">
    <LanguageSelector />
    <div class="flex justify-center md:flex-1 md:flex md:min-h-0">
      <div class="w-full max-w-md md:flex md:flex-col md:min-h-0">
        <div class="game-card-glow bg-[rgba(21,27,35,0.8)] backdrop-blur-xl border border-white/[0.08] rounded-[20px] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.03)] mt-6 relative overflow-hidden md:mt-1 md:p-2 md:rounded-xl md:flex-1 md:flex md:flex-col md:min-h-0">
          <h1 class="text-center my-2 font-[Roboto,sans-serif] font-light text-white text-3xl tracking-wide md:text-xl md:mb-1 md:mt-0">{{ t('title') }}</h1>
          <p class="text-center hidden sm:block mb-3 font-[Inter,sans-serif] font-normal text-white/60 text-sm">
            {{ t('description') }}
            <br />{{ t('attemptsText') }}
          </p>
          
          <!-- Table -->
          <div class="mb-6 md:mb-1 md:flex-1 md:min-h-0">
            <table class="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th class="w-1/2 font-[Roboto,sans-serif] font-normal text-xs text-white/50 uppercase tracking-widest pb-3 border-b border-white/[0.08] md:text-[0.65rem] md:py-1 md:px-2">{{ t('guess') }}</th>
                  <th class="w-1/4 text-center font-[Roboto,sans-serif] font-normal text-xs text-white/50 uppercase tracking-widest pb-3 border-b border-white/[0.08] md:text-[0.65rem] md:py-1 md:px-2">
                    <Popper hover arrow>
                      <span class="flex items-center justify-center">
                        <span class="mr-1">{{ t('goods') }}</span>
                        <CircleInfo class="w-3.5 h-3.5 text-white/40" />
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
                  <th class="w-1/4 text-center font-[Roboto,sans-serif] font-normal text-xs text-white/50 uppercase tracking-widest pb-3 border-b border-white/[0.08] md:text-[0.65rem] md:py-1 md:px-2">
                    <Popper hover arrow>
                      <span class="flex items-center justify-center">
                        <span class="mr-1">{{ t('corrects') }}</span>
                        <CircleInfo class="w-3.5 h-3.5 text-white/40" />
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
                <tr 
                  v-for="(attempt, index) in Array(10)" 
                  :key="index" 
                  class="h-9 md:h-8 odd:bg-white/[0.03] even:bg-transparent hover:bg-white/[0.06]"
                >
                  <td class="align-middle px-3 md:px-2 text-white/90 font-[Roboto,sans-serif] font-light text-xl tracking-[0.4rem] md:text-base md:tracking-[0.25rem]">
                    <span v-if="attempts[index]?.guess" class="animate-fade-in">{{
                      attempts[index]?.guess
                    }}</span>
                    <span v-else class="inline-block h-5 md:h-4 invisible">&nbsp;</span>
                  </td>
                  <td class="align-middle px-3 md:px-2 text-center">
                    <span 
                      v-if="attempts[index]?.cows !== undefined" 
                      :class="['animate-fade-in score-badge-goods md:min-w-[28px] md:h-6 md:px-2 md:text-sm', { 'score-badge-zero': attempts[index]?.cows === 0 }]"
                    >{{
                      attempts[index]?.cows
                    }}</span>
                    <span v-else class="inline-block min-w-[40px] h-8 md:min-w-[28px] md:h-6 invisible">&nbsp;</span>
                  </td>
                  <td class="align-middle px-3 md:px-2 text-center">
                    <span 
                      v-if="attempts[index]?.bulls !== undefined" 
                      :class="['animate-fade-in score-badge-corrects md:min-w-[28px] md:h-6 md:px-2 md:text-sm', { 'score-badge-zero': attempts[index]?.bulls === 0 }]"
                    >{{
                      attempts[index]?.bulls
                    }}</span>
                    <span v-else class="inline-block min-w-[40px] h-8 md:min-w-[28px] md:h-6 invisible">&nbsp;</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Input Form -->
          <form v-if="!message.show" @submit.prevent="submitGuess" class="flex md:shrink-0 md:mb-1">
            <div class="relative w-full">
              <div class="flex items-center w-full bg-transparent border-2 border-[#333] overflow-hidden" @click="focusInput">
                <div class="flex-1 flex items-center justify-center py-4 px-6 gap-2 bg-transparent cursor-text md:py-1.5 md:px-4 md:gap-1">
                  <span v-for="i in 4" :key="i" class="font-[Roboto,sans-serif] font-light text-3xl min-w-6 text-center md:text-2xl md:min-w-5">
                    <span v-if="guess[i-1]" class="text-white">{{ guess[i-1] }}</span>
                    <span v-else-if="i === guess.length + 1" class="text-white animate-blink">_</span>
                    <span v-else class="text-white/15">_</span>
                  </span>
                </div>
                <input
                  ref="hiddenInput"
                  v-model="guess"
                  type="text"
                  pattern="^(?!.*(.).*\1)[1-9]{1,4}$"
                  maxlength="4"
                  required
                  class="absolute opacity-0 pointer-events-none"
                  :disabled="attempts.length === 10 || message.show"
                  @input="validateInput"
                  :readonly="isMobile()"
                />
                <button :disabled="guess.length < 4" type="submit" class="bg-transparent border-none border-l-2 border-l-[#333] py-4 px-6 cursor-pointer transition-all duration-200 flex items-center justify-center md:py-2 md:px-4 disabled:cursor-not-allowed">
                  <PaperPlaneIcon class="w-6 h-6 text-white/50 transition-colors duration-200 hover:text-white md:w-5 md:h-5" :class="{ '!text-white/20': guess.length < 4 }" />
                </button>
              </div>
              <transition name="tooltip-fade">
                <div v-if="errorTooltip.show" class="error-tooltip">
                  {{ errorTooltip.text }}
                </div>
              </transition>
            </div>
          </form>

          <!-- Numpad (mobile only) -->
          <div v-if="!message.show" class="block md:hidden mt-1 p-1.5 bg-black/20 rounded-xl border border-white/5 shrink-0">
            <div class="flex justify-around my-0.5">
              <button
                v-for="n in 5"
                :key="n"
                @click="appendToInput(n)"
                class="numpad-btn w-[42px] h-[42px] rounded-lg text-base"
                :disabled="attempts.length === 10 || message.show"
              >
                {{ n }}
              </button>
            </div>
            <div class="flex justify-around my-0.5">
              <button
                v-for="n in 4"
                :key="n + 5"
                @click="appendToInput(n + 5)"
                class="numpad-btn w-[42px] h-[42px] rounded-lg text-base"
                :disabled="attempts.length === 10 || message.show"
              >
                {{ n + 5 }}
              </button>
              <button
                @click="removeFromInput"
                class="numpad-btn numpad-btn-delete w-[42px] h-[42px] rounded-lg text-base"
                :disabled="attempts.length === 10 || message.show"
              >
                &times;
              </button>
            </div>
          </div>

          <!-- Alert -->
          <div
            v-if="message.show"
            :class="['game-alert mt-3 md:mt-2 md:py-3 md:px-4 md:text-sm md:gap-2 shrink-0', message.variant === 'success' ? 'game-alert-success' : 'game-alert-danger']"
            role="alert"
          >
            {{ message.text }}
            <button @click="resetGame" class="btn-reset text-sm mt-2 md:py-1.5 md:px-4 md:text-xs">
              {{ t('playAgain') }}
            </button>
          </div>

          <!-- Reset button -->
          <div v-else class="text-center my-3 md:my-1 md:shrink-0">
            <button @click="resetGame" class="btn-reset text-sm md:py-1.5 md:px-4 md:text-xs">
              <RotateLeftIcon class="inline mr-1 w-4 h-4 text-white/60" />
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
  const validValue = currentValue.replace(/[^1-9]/g, '')
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

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (message.value.show || attempts.value.length >= 10) return
  
  if (/^[1-9]$/.test(e.key)) {
    e.preventDefault()
    if (guess.value.length >= 4) return
    if (guess.value.includes(e.key)) {
      showErrorTooltip(t('duplicateDigitError', e.key))
      return
    }
    guess.value += e.key
  }
  
  if (e.key === 'Backspace') {
    e.preventDefault()
    guess.value = guess.value.slice(0, -1)
  }
  
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

/* Animation keyframes */
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s infinite;
}

/* Tooltip transition */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}
</style>
