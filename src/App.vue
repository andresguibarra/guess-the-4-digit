<template>
  <div class="relative p-1 h-dvh flex flex-col overflow-hidden grid-background md:p-4 md:min-h-screen md:h-auto md:flex md:items-center md:justify-center md:overflow-visible">
    <!-- Floating particles -->
    <div class="particles-container">
      <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle()"></div>
    </div>
    
    <!-- Confetti container -->
    <div ref="confettiContainer" class="confetti-container"></div>
    
    <LanguageSelector />
    <div class="flex-1 flex justify-center min-h-0 md:flex md:justify-center md:flex-none">
      <div class="w-full max-w-md flex flex-col min-h-0 md:block">
        <div :class="['game-card-glow bg-[rgba(21,27,35,0.8)] backdrop-blur-xl border border-white/[0.08] rounded-xl p-2 shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.03)] mt-1 relative overflow-hidden flex-1 flex flex-col min-h-0 md:rounded-[20px] md:p-7 md:mt-6 md:block md:overflow-visible transition-all duration-300', { 'shake-animation': isShaking, 'win-glow': hasWon }]">
          <h1 :class="['text-center mb-1 mt-0 font-[Roboto,sans-serif] font-light text-white text-xl tracking-wide md:text-3xl md:my-2 title-glow', { 'win-title': hasWon }]">{{ t('title') }}</h1>
          <p class="text-center hidden sm:block mb-3 font-[Inter,sans-serif] font-normal text-white/60 text-sm animate-fade-in-delayed">
            {{ t('description') }}
            <br />{{ t('attemptsText') }}
          </p>
          
          <!-- Table -->
          <div class="flex-1 min-h-0 mb-1 md:mb-6 md:flex-none">
            <table class="w-full h-full border-separate border-spacing-0 md:h-auto">
              <thead>
                <tr>
                  <th class="w-1/2 font-[Roboto,sans-serif] font-normal text-[0.65rem] text-white/50 uppercase tracking-widest py-1 px-2 border-b border-white/[0.08] md:text-xs md:pb-3 md:pt-0">{{ t('guess') }}</th>
                  <th class="w-1/4 text-center font-[Roboto,sans-serif] font-normal text-[0.65rem] text-white/50 uppercase tracking-widest py-1 px-2 border-b border-white/[0.08] md:text-xs md:pb-3 md:pt-0">
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
                  <th class="w-1/4 text-center font-[Roboto,sans-serif] font-normal text-[0.65rem] text-white/50 uppercase tracking-widest py-1 px-2 border-b border-white/[0.08] md:text-xs md:pb-3 md:pt-0">
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
              <tbody class="flex-1">
                <tr 
                  v-for="(attempt, index) in Array(10)" 
                  :key="index" 
                  :class="['h-[calc((100%-2rem)/10)] md:h-9 odd:bg-white/[0.03] even:bg-transparent hover:bg-white/[0.06] transition-all duration-200', { 'row-just-added': index === attempts.length - 1 && justAdded }]"
                >
                  <td class="align-middle px-2 md:px-3 text-white/90 font-[Roboto,sans-serif] font-light text-base tracking-[0.25rem] md:text-xl md:tracking-[0.4rem]">
                    <span v-if="attempts[index]?.guess" class="guess-digits">
                      <span 
                        v-for="(digit, dIndex) in attempts[index].guess.split('')" 
                        :key="dIndex" 
                        class="digit-char"
                        :style="{ animationDelay: `${dIndex * 0.03}s` }"
                      >{{ digit }}</span>
                    </span>
                    <span v-else class="inline-block h-4 md:h-5 invisible">&nbsp;</span>
                  </td>
                  <td class="align-middle px-2 md:px-3 text-center">
                    <span 
                      v-if="attempts[index]?.cows !== undefined" 
                      :class="['animate-score-pop score-badge-goods min-w-[28px] h-6 px-2 text-sm md:min-w-[40px] md:h-8 md:px-3 md:text-base', { 'score-badge-zero': attempts[index]?.cows === 0 }]"
                      :style="{ animationDelay: '0.12s' }"
                    >{{
                      attempts[index]?.cows
                    }}</span>
                    <span v-else class="inline-block min-w-[28px] h-6 md:min-w-[40px] md:h-8 invisible">&nbsp;</span>
                  </td>
                  <td class="align-middle px-2 md:px-3 text-center">
                    <span 
                      v-if="attempts[index]?.bulls !== undefined" 
                      :class="['animate-score-pop score-badge-corrects min-w-[28px] h-6 px-2 text-sm md:min-w-[40px] md:h-8 md:px-3 md:text-base', { 'score-badge-zero': attempts[index]?.bulls === 0, 'score-perfect': attempts[index]?.bulls === 4 }]"
                      :style="{ animationDelay: '0.18s' }"
                    >{{
                      attempts[index]?.bulls
                    }}</span>
                    <span v-else class="inline-block min-w-[28px] h-6 md:min-w-[40px] md:h-8 invisible">&nbsp;</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Input Form -->
          <form v-if="!message.show" @submit.prevent="submitGuess" class="flex shrink-0 mb-1 md:mb-0">
            <div class="relative w-full">
              <div :class="['input-container flex items-center w-full bg-transparent border-2 border-[#333] overflow-hidden transition-all duration-300', { 'input-ready': guess.length === 4, 'input-typing': guess.length > 0 && guess.length < 4 }]" @click="focusInput">
                <div class="flex-1 flex items-center justify-center py-1.5 px-4 gap-1 bg-transparent cursor-text md:py-4 md:px-6 md:gap-2">
                  <span v-for="i in 4" :key="i" :class="['digit-input-box font-[Roboto,sans-serif] font-light text-2xl min-w-5 text-center md:text-3xl md:min-w-6 transition-all duration-200', { 'digit-filled': guess[i-1], 'digit-active': i === guess.length + 1 }]">
                    <span v-if="guess[i-1]" class="text-white animate-digit-pop">{{ guess[i-1] }}</span>
                    <span v-else-if="i === guess.length + 1" class="text-white animate-blink cursor-line">|</span>
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
                <button :disabled="guess.length < 4" type="submit" :class="['submit-btn bg-transparent border-none border-l-2 border-l-[#333] py-2 px-5 mr-2 cursor-pointer transition-all duration-200 flex items-center justify-center md:py-4 md:px-6 md:mr-3 disabled:cursor-not-allowed', { 'submit-ready': guess.length === 4 }]">
                  <PaperPlaneIcon :class="['w-5 h-5 transition-all duration-200 md:w-6 md:h-6', guess.length === 4 ? 'text-[#38bdf8] animate-pulse-glow' : 'text-white/20']" />
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
                :class="['numpad-btn w-[42px] h-[42px] rounded-lg text-base', { 'numpad-used': guess.includes(n.toString()) }]"
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
                :class="['numpad-btn w-[42px] h-[42px] rounded-lg text-base', { 'numpad-used': guess.includes((n + 5).toString()) }]"
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
          <transition name="result-reveal">
            <div
              v-if="message.show"
              :class="['game-alert mt-3 md:mt-2 md:py-3 md:px-4 md:text-sm md:gap-2 shrink-0', message.variant === 'success' ? 'game-alert-success' : 'game-alert-danger']"
              role="alert"
            >
              <div class="result-emoji">{{ message.variant === 'success' ? '🎉' : '💔' }}</div>
              <div class="result-text">{{ message.text.split(secretNumber)[0] }}</div>
              <div class="secret-reveal">
                <span 
                  v-for="(digit, index) in secretNumber.split('')" 
                  :key="index" 
                  class="secret-digit"
                  :style="{ animationDelay: `${0.5 + index * 0.15}s` }"
                >{{ digit }}</span>
              </div>
              <button @click="resetGame" :class="['btn-reset-fancy text-sm mt-2 group', message.variant === 'success' ? 'btn-reset-success' : 'btn-reset-danger']">
                <span class="btn-text">{{ t('playAgain') }}</span>
                <RotateLeftIcon class="w-5 h-5 transition-transform duration-500 group-hover:rotate-[-360deg]" />
              </button>
            </div>
          </transition>

          <!-- Reset button -->
          <div v-if="!message.show" class="text-center my-3 md:my-1 md:shrink-0">
            <button @click="resetGame" class="btn-reset group text-sm md:py-1.5 md:px-4 md:text-xs">
              <RotateLeftIcon class="inline mr-1 w-4 h-4 text-white/60 transition-transform duration-300 group-hover:-rotate-180" />
              {{ t('reset') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue'
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
const confettiContainer = ref<HTMLDivElement | null>(null)
const isShaking = ref(false)
const justAdded = ref(false)
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

const hasWon = computed(() => message.value.show && message.value.variant === 'success')

const getParticleStyle = () => {
  const size = 2 + Math.random() * 4
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}

const createConfetti = () => {
  if (!confettiContainer.value) return
  
  const colors = ['#4ade80', '#38bdf8', '#818cf8', '#fb923c', '#f87171', '#fbbf24', '#a78bfa', '#34d399']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.setProperty('--x', `${(Math.random() - 0.5) * 600}px`)
    confetti.style.setProperty('--y', `${-Math.random() * 400 - 200}px`)
    confetti.style.setProperty('--r', `${Math.random() * 720 - 360}deg`)
    confetti.style.left = `${50 + (Math.random() - 0.5) * 20}%`
    confetti.style.top = '50%'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = `${Math.random() * 0.3}s`
    
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = '50%'
    }
    
    confettiContainer.value.appendChild(confetti)
  }
  
  setTimeout(() => {
    if (confettiContainer.value) {
      confettiContainer.value.innerHTML = ''
    }
  }, 3000)
}

const triggerShake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 600)
}

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
    
    justAdded.value = true
    setTimeout(() => {
      justAdded.value = false
    }, 500)

    if (bulls === 4) {
      message.value = {
        show: true,
        text: t('winMessage', secretNumber.value),
        variant: 'success'
      }
      setTimeout(() => {
        createConfetti()
      }, 300)
    } else if (attempts.value.length === 10) {
      message.value = {
        show: true,
        text: t('loseMessage', secretNumber.value),
        variant: 'danger'
      }
      triggerShake()
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
  guess.value = ''
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

@keyframes digitPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes scorePop {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes confettiFall {
  0% { 
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% { 
    transform: translateY(var(--y)) translateX(var(--x)) rotate(var(--r));
    opacity: 0;
  }
}

@keyframes particleFloat {
  0%, 100% { 
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-30px) translateX(10px);
    opacity: 0.8;
  }
}

@keyframes pulseGlow {
  0%, 100% { 
    filter: drop-shadow(0 0 2px currentColor);
  }
  50% { 
    filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 20px currentColor);
  }
}

@keyframes winGlow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.3),
                0 0 40px rgba(74, 222, 128, 0.2),
                0 0 60px rgba(74, 222, 128, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(74, 222, 128, 0.5),
                0 0 60px rgba(74, 222, 128, 0.3),
                0 0 90px rgba(74, 222, 128, 0.2);
  }
}

@keyframes titleGlow {
  0%, 100% { 
    text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }
  50% { 
    text-shadow: 0 0 20px rgba(74, 222, 128, 0.8),
                 0 0 40px rgba(74, 222, 128, 0.5);
  }
}

@keyframes secretDigitReveal {
  0% { 
    transform: scale(0) rotateY(180deg);
    opacity: 0;
  }
  60% { 
    transform: scale(1.2) rotateY(-10deg);
  }
  100% { 
    transform: scale(1) rotateY(0deg);
    opacity: 1;
  }
}

@keyframes rowHighlight {
  0% { 
    background: rgba(56, 189, 248, 0.3);
  }
  100% { 
    background: transparent;
  }
}

@keyframes fadeInUp {
  0% { 
    transform: translateY(20px);
    opacity: 0;
  }
  100% { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes emojiPop {
  0% { 
    transform: scale(0) rotate(-180deg);
  }
  50% { 
    transform: scale(1.3) rotate(10deg);
  }
  100% { 
    transform: scale(1) rotate(0deg);
  }
}

@keyframes buttonShine {
  0% { 
    background-position: -200% center;
  }
  100% { 
    background-position: 200% center;
  }
}

.animate-blink {
  animation: blink 1s infinite;
}

.animate-digit-pop {
  display: inline-block;
  animation: digitPop 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.animate-score-pop {
  opacity: 0;
  animation: scorePop 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.animate-pulse-glow {
  animation: pulseGlow 1.5s ease-in-out infinite;
}

.animate-fade-in-delayed {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

/* Shake animation for loss */
.shake-animation {
  animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
}

/* Win glow effect */
.win-glow {
  animation: winGlow 2s ease-in-out infinite;
  border-color: rgba(74, 222, 128, 0.5) !important;
}

.win-title {
  animation: titleGlow 2s ease-in-out infinite;
  color: #4ade80 !important;
}

/* Title glow */
.title-glow {
  transition: all 0.3s ease;
}

/* Particles */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(56, 189, 248, 0.6);
  border-radius: 50%;
  animation: particleFloat 5s ease-in-out infinite;
}

/* Confetti */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confettiFall 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Digit input styling */
.digit-input-box {
  position: relative;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.digit-filled {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.digit-active {
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.cursor-line {
  font-weight: 100;
  color: #38bdf8 !important;
}

/* Input container states */
.input-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-typing {
  border-color: rgba(56, 189, 248, 0.3) !important;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
}

.input-ready {
  border-color: rgba(74, 222, 128, 0.5) !important;
  box-shadow: 0 0 30px rgba(74, 222, 128, 0.2);
}

/* Submit button states */
.submit-btn {
  position: relative;
  overflow: hidden;
}

.submit-ready {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(74, 222, 128, 0.1)) !important;
}

.submit-ready::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: buttonShine 2s infinite;
}

/* Guess digits animation */
.guess-digits {
  display: inline-flex;
  gap: 2px;
}

.digit-char {
  display: inline-block;
  animation: digitPop 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

/* Row animation */
.row-just-added {
  animation: rowHighlight 0.5s ease-out;
}

/* Score perfect animation */
.score-perfect {
  animation: scorePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
             pulseGlow 1s ease-in-out infinite 0.5s !important;
  background: rgba(74, 222, 128, 0.3) !important;
  border-color: rgba(74, 222, 128, 0.6) !important;
}

/* Numpad used state */
.numpad-used {
  opacity: 0.4;
  background: rgba(56, 189, 248, 0.1) !important;
  border-color: rgba(56, 189, 248, 0.3) !important;
  color: #38bdf8 !important;
}

/* Result reveal transition */
.result-reveal-enter-active {
  animation: fadeInUp 0.5s ease-out;
}

.result-reveal-leave-active {
  animation: fadeInUp 0.3s ease-in reverse;
}

/* Result emoji */
.result-emoji {
  font-size: 3rem;
  animation: emojiPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
  margin-bottom: 8px;
}

/* Result text */
.result-text {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 8px;
}

/* Secret reveal */
.secret-reveal {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.secret-digit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 56px;
  font-size: 1.75rem;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid currentColor;
  border-radius: 12px;
  animation: secretDigitReveal 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

/* Fancy reset button */
.btn-reset-fancy {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-reset-success {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0f1419;
  box-shadow: 0 4px 20px rgba(74, 222, 128, 0.4);
}

.btn-reset-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(74, 222, 128, 0.6);
}

.btn-reset-danger {
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: white;
  box-shadow: 0 4px 20px rgba(248, 113, 113, 0.4);
}

.btn-reset-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(248, 113, 113, 0.6);
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
