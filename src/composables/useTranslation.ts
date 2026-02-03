import { ref, computed } from 'vue'

export type Language = 'en' | 'es'

interface Translations {
  [key: string]: {
    en: string
    es: string
  }
}

const translations: Translations = {
  // Main content
  title: {
    en: 'Guess the 4-digit number',
    es: 'Adivina el número de 4 dígitos'
  },
  description: {
    en: 'Try to guess the secret 4-digit number with unique digits from 1 to 9.',
    es: 'Trata de adivinar el número secreto de 4 dígitos con dígitos únicos del 1 al 9.'
  },
  attemptsText: {
    en: 'You have 10 attempts.',
    es: 'Tienes 10 intentos.'
  },
  
  // Table headers
  guess: {
    en: 'Guess',
    es: 'Intento'
  },
  goods: {
    en: 'Goods',
    es: 'Buenas'
  },
  corrects: {
    en: 'Corrects',
    es: 'Correctas'
  },
  
  // Tooltips
  goodsTitle: {
    en: '🔶 Goods (Right digit, wrong spot)',
    es: '🔶 Buenas (Dígito correcto, lugar equivocado)'
  },
  goodsTooltip: {
    en: 'Digits that ARE in the secret number but NOT in the right position.',
    es: 'Dígitos que SÍ están en el número secreto pero NO en la posición correcta.'
  },
  goodsHint: {
    en: '4 and 7 exist but swapped places!',
    es: '¡4 y 7 existen pero están intercambiados!'
  },
  correctsTitle: {
    en: '✅ Corrects (Perfect match!)',
    es: '✅ Correctas (¡Coincidencia perfecta!)'
  },
  correctsTooltip: {
    en: 'Digits that ARE in the secret number AND in the exact same position.',
    es: 'Dígitos que SÍ están en el número secreto Y en la misma posición exacta.'
  },
  correctsHint: {
    en: '5 and 7 are in the exact right spot!',
    es: '¡5 y 7 están en el lugar exacto!'
  },
  example: {
    en: 'Example',
    es: 'Ejemplo'
  },
  secretLabel: {
    en: 'Secret',
    es: 'Secreto'
  },
  guessLabel: {
    en: 'Guess',
    es: 'Intento'
  },
  
  // Input and buttons
  inputPlaceholder: {
    en: 'Enter your guess',
    es: 'Ingresa tu intento'
  },
  playAgain: {
    en: 'Play again',
    es: 'Jugar de nuevo'
  },
  reset: {
    en: 'Reset',
    es: 'Reiniciar'
  },
  
  // Messages
  winMessage: {
    en: 'You won! The secret number is',
    es: '¡Ganaste! El número secreto es'
  },
  loseMessage: {
    en: 'Game over. The secret number was',
    es: 'Juego terminado. El número secreto era'
  },
  
  // Validation messages
  invalidDigits: {
    en: 'Please enter a 4-digit number with digits from 1 to 9 (inclusive)',
    es: 'Por favor ingresa un número de 4 dígitos con dígitos del 1 al 9 (inclusive)'
  },
  duplicateDigits: {
    en: 'No duplicate digits allowed',
    es: 'No se permiten dígitos duplicados'
  },
  duplicateDigitError: {
    en: 'Digit {0} is already used',
    es: 'El dígito {0} ya fue usado'
  },
  
  // Language selector
  language: {
    en: 'Language',
    es: 'Idioma'
  }
}

// Get initial language from localStorage or default to English
const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('game-language')
  return (saved === 'es' || saved === 'en') ? saved : 'en'
}

const currentLanguage = ref<Language>(getInitialLanguage())

export const useTranslation = () => {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('game-language', lang)
  }

  const t = (key: string, value?: string | number): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation key "${key}" not found`)
      return key
    }
    
    let text = translation[currentLanguage.value]
    
    // Handle dynamic values with {0} placeholder
    if (value !== undefined) {
      if (text.includes('{0}')) {
        text = text.replace('{0}', String(value))
      } else {
        // Fallback for messages like win/lose that append the value
        text = `${text} ${value}.`
      }
    }
    
    return text
  }

  return {
    currentLanguage: computed(() => currentLanguage.value),
    setLanguage,
    t
  }
}