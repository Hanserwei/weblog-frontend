import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore(
  'layout',
  () => {
    const collapsed = ref(false)

    return { collapsed }
  },
  {
    persist: true,
  },
)
