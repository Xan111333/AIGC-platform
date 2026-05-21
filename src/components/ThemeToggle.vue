<template>
  <button 
    class="theme-toggle" 
    :class="{ 'is-dark': isDark }"
    @click="toggleTheme"
    :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <svg 
      v-if="!isDark" 
      class="icon sun-icon" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    <svg 
      v-else 
      class="icon moon-icon" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = prefersDark
  }
  
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  loadTheme()
})
</script>

<style scoped>
.theme-toggle {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
}

.theme-toggle:hover {
  background: var(--color-bg-glass-hover);
  color: var(--color-text-primary);
  border-color: rgba(99, 102, 241, 0.3);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.98);
}

.icon {
  transition: all var(--transition-normal);
}

.sun-icon {
  animation: spin 20s linear infinite;
}

.sun-icon:hover {
  animation: spin 10s linear infinite;
}

.moon-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.is-dark .moon-icon {
  color: #fbbf24;
}

:not(.is-dark) .sun-icon {
  color: #f59e0b;
}
</style>
