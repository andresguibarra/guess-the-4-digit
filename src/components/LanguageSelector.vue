<template>
  <div class="language-selector">
    <select 
      :value="currentLanguage" 
      @change="handleLanguageChange"
      class="form-select form-select-sm"
      :aria-label="t('language')"
    >
      <option value="en">🇺🇸 English</option>
      <option value="es">🇪🇸 Español</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useTranslation, type Language } from '../composables/useTranslation'

const { currentLanguage, setLanguage, t } = useTranslation()

const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setLanguage(target.value as Language)
}
</script>

<style scoped>
.language-selector {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

.form-select-sm {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  padding: 0.4rem 0.75rem;
  min-width: auto;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(21, 27, 35, 0.9);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.form-select-sm option {
  background: #151b23;
  color: #fff;
}

.form-select-sm:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(21, 27, 35, 1);
}

.form-select-sm:focus {
  border-color: var(--game-primary, #38bdf8);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
  outline: none;
}

@media (max-width: 768px) {
  .language-selector {
    position: static;
    margin-bottom: 0.5rem;
    text-align: center;
    padding-top: 0.5rem;
  }
}
</style>