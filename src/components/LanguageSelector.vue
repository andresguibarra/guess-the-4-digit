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
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}

.form-select-sm {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  min-width: auto;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-select-sm:hover {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.form-select-sm:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  outline: none;
}

@media (max-width: 768px) {
  .language-selector {
    position: static;
    margin-bottom: 1rem;
    text-align: center;
    padding-top: 1rem;
  }
}
</style>