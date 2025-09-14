import { computed, ref } from 'vue'

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // state
  const counter = ref(0)

  // getters
  const doubleCount = computed(() => counter.value * 2)

  // actions
  const increment = () => {
    counter.value++
  }

  return { counter, doubleCount, increment }
})
