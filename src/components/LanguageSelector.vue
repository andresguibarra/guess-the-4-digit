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
  font-size: 0.875rem;
  padding: 0.4rem 0.75rem;
  min-width: auto;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;
}

.form-select-sm:hover {
  border-color: #cbd5e1;
}

.form-select-sm:focus {
  border-color: var(--game-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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