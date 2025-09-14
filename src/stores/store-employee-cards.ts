import { computed, ref } from 'vue'

import { defineStore } from 'pinia'

import { getCollection } from 'src/boot/firebase'
import { LEVELS_MAP } from 'src/types/emloyee-card'
import type { TNewEmployee } from 'src/types/new-employee'
import { STORE_TYPES } from 'src/types/store'

export const useStoreEmployeeCards = defineStore(
  STORE_TYPES.EMPLOYEE_CARDS,
  () => {
    // state
    const isFilterVisible = ref(false)
    const employeeList = ref<TNewEmployee[]>([])
    const selectedFromLevel = ref<string | null>(null)
    const selectedFromPosition = ref<string | null>(null)
    const selectedFromRating = ref<number | null>(null)

    // getters
    const isEmployeeList = computed(() => employeeList.value.length > 0)

    const filteredEmployeeList = computed(() => {
      if (!isFilterVisible.value) return employeeList.value

      if (
        !selectedFromLevel.value &&
        !selectedFromPosition.value &&
        !selectedFromRating.value
      ) {
        return employeeList.value
      }

      return employeeList.value.filter(
        ({ level, position, rate }) =>
          level === selectedFromLevel.value ||
          position === selectedFromPosition.value ||
          rate === selectedFromRating.value
      )
    })

    const optionsEmployeeLevel = computed(() => [
      ...new Set(employeeList.value.map((employee) => employee?.level)),
    ])
    const optionsEmployeePosition = computed(() => [
      ...new Set(employeeList.value.map((employee) => employee?.position)),
    ])
    const optionsEmployeeRating = computed(() => [
      ...new Set(employeeList.value.map((employee) => employee?.rate)),
    ])

    // actions
    const getEmployeeList = async () => {
      const employees = await getCollection('employees')

      const NEW_EMPLOYEE_LIST: TNewEmployee[] = []

      employees.forEach((doc) =>
        NEW_EMPLOYEE_LIST.push({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          position: doc.data().position,
          level: doc.data().level,
          description: doc.data().description,
          rate: doc.data().rate,
        })
      )

      if (NEW_EMPLOYEE_LIST.length) {
        employeeList.value = NEW_EMPLOYEE_LIST
      }
    }

    const getColorFromLevel = (level: string) =>
      LEVELS_MAP.find(({ name }) => name === level)?.color

    return {
      // state
      isFilterVisible,
      employeeList,
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
