import { computed, ref, watch } from 'vue'

import { defineStore } from 'pinia'

import { toErrorMessage } from '@/shared/lib/errors'
import { STORE_TYPES } from '@/types/store'

import { listEmployees } from '../api/employeeRepository'
import { filterEmployees } from './filters'
import { LEVELS_MAP } from './types'
import type { TNewEmployee } from './types'

export const useStoreEmployeeCards = defineStore(
  STORE_TYPES.EMPLOYEE_CARDS,
  () => {
    // state
    const isFilterVisible = ref(false)
    const employeeList = ref<TNewEmployee[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const selectedFromLevel = ref<string | null>(null)
    const selectedFromPosition = ref<string | null>(null)
    const selectedFromRating = ref<number | null>(null)

    // getters
    const isEmployeeList = computed(() => employeeList.value.length > 0)

    const filteredEmployeeList = computed(() =>
      filterEmployees(employeeList.value, {
        level: selectedFromLevel.value,
        position: selectedFromPosition.value,
        rating: selectedFromRating.value,
      })
    )

    const optionsEmployeeLevel = computed(() => [
      ...new Set(employeeList.value.map((employee) => employee?.level)),
    ])
    const optionsEmployeePosition = computed(() => [
      ...new Set(employeeList.value.map((employee) => employee?.position)),
    ])
    const optionsEmployeeRating = computed(() => [
      ...new Set(employeeList.value.map((employee) => employee?.rate)),
    ])

    // Hiding the filter panel clears active filters, so the list never stays
    // filtered by invisible controls.
    watch(isFilterVisible, (visible) => {
      if (!visible) {
        selectedFromLevel.value = null
        selectedFromPosition.value = null
        selectedFromRating.value = null
      }
    })

    // actions
    const getEmployeeList = async (): Promise<void> => {
      loading.value = true
      error.value = null

      try {
        // Always assign, so an empty collection clears the previous list.
        employeeList.value = await listEmployees()
      } catch (caught) {
        employeeList.value = []
        error.value = toErrorMessage(
          caught,
          'Не удалось загрузить список сотрудников'
        )
      } finally {
        loading.value = false
      }
    }

    const getColorFromLevel = (level: string) =>
      LEVELS_MAP.find(({ name }) => name === level)?.color

    return {
      // state
      isFilterVisible,
      employeeList,
      loading,
      error,
      selectedFromLevel,
      selectedFromPosition,
      selectedFromRating,

      // getters
      isEmployeeList,
      filteredEmployeeList,
      optionsEmployeeLevel,
      optionsEmployeePosition,
      optionsEmployeeRating,

      // actions
      getEmployeeList,
      getColorFromLevel,
    }
  }
)
