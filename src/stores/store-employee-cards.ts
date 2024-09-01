import { defineStore, } from 'pinia'

import { LEVELS_MAP, } from 'src/types/emloyee-card'
import type { TEmployeeCardsState, } from 'src/types/emloyee-card'
import type { TNewEmployee, } from 'src/types/new-employee'
import { STORE_TYPES, } from 'src/types/store'

import { getCollection, } from 'src/boot/firebase'

export const useStoreEmployeeCards = defineStore(STORE_TYPES.EMPLOYEE_CARDS, {
  state: (): TEmployeeCardsState => ({
    isFilterVisible: false,
    employeeList: [],
    selectedFromLevel: null,
    selectedFromPosition: null,
    selectedFromRating: null,
  }),
  getters: {
    isEmployeeList: (state) => state.employeeList.length > 0,
    filteredEmployeeList: ({
      isFilterVisible,
      employeeList,
      selectedFromLevel,
      selectedFromPosition,
      selectedFromRating,
    }) =>
      isFilterVisible
        ? selectedFromLevel || selectedFromPosition || selectedFromRating
          ? employeeList.filter(
            ({ level, position, rate, }: { level: string | null, position: string | null, rate: number | null, }): boolean =>
              level === selectedFromLevel || position === selectedFromPosition || rate === selectedFromRating
          )
          : employeeList
        : employeeList,
    optionsEmployeeLevel: ({ employeeList, }) => [
      ...new Set(employeeList.map((employee) => employee?.level)),
    ],
    optionsEmployeePosition: ({ employeeList, }) => [
      ...new Set(employeeList.map((employee) => employee?.position)),
    ],
    optionsEmployeeRating: ({ employeeList, }) => [
      ...new Set(employeeList.map((employee) => employee?.rate)),
    ],
  },
  actions: {
    async getEmployeeList () {
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
        this.employeeList = NEW_EMPLOYEE_LIST
      }
    },
    getColorFromLevel: (level: string) =>
      LEVELS_MAP.find(({ name, }) => name === level)?.color,
  },
})
