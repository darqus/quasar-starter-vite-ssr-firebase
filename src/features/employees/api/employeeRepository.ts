import type {
  addDoc as addDocType,
  collection as collectionType,
  getDocs as getDocsType,
} from 'firebase/firestore'
import { z } from 'zod'

import { getDb } from '@/lib/firebase/client'
import { AppError, toAppError } from '@/shared/lib/errors'

import type { TNewEmployee } from '../model/types'

/** Single source of truth for the Firestore collection name. */
export const EMPLOYEES_COLLECTION = 'employees'

type FirestoreSdk = {
  addDoc: typeof addDocType
  collection: typeof collectionType
  getDocs: typeof getDocsType
}

let firestoreSdk: Promise<FirestoreSdk> | undefined

/**
 * Firestore is not part of the initial bundle: the SDK is imported together
 * with the lazily created database instance.
 */
const loadFirestoreSdk = (): Promise<FirestoreSdk> => {
  firestoreSdk ??= import('firebase/firestore')

  return firestoreSdk
}

/**
 * Firestore is schemaless, and historical documents store `rate` as a string.
 * `z.coerce.number()` keeps both old and new documents readable.
 */
const employeeDocSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  position: z.string().min(1),
  level: z.string().min(1),
  description: z.string().optional().default(''),
  rate: z.coerce.number(),
})

const createEmployeeSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().min(1),
  position: z.string().trim().min(1),
  level: z.string().trim().min(1),
  description: z.string().optional().default(''),
  rate: z.coerce.number().int().min(1).max(5),
})

export type CreateEmployeeInput = {
  name: string
  email: string
  position: string
  level: string
  rate: number | string
  description?: string
}

const INVALID_EMPLOYEE_MESSAGE = 'Проверьте заполнение полей сотрудника'

/**
 * Reads all employees and drops malformed documents instead of failing the
 * whole list: one broken record must not hide the rest.
 */
export const listEmployees = async (): Promise<TNewEmployee[]> => {
  try {
    const [db, { collection, getDocs }] = await Promise.all([
      getDb(),
      loadFirestoreSdk(),
    ])
    const snapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    const employees: TNewEmployee[] = []

    snapshot.docs.forEach((document) => {
      const parsed = employeeDocSchema.safeParse(document.data())

      if (!parsed.success) {
        return
      }

      employees.push({
        id: document.id,
        ...parsed.data,
      })
    })

    return employees
  } catch (error) {
    throw toAppError(error, 'Не удалось загрузить список сотрудников')
  }
}

/** Creates an employee and returns the generated Firestore document id. */
export const createEmployee = async (
  input: CreateEmployeeInput
): Promise<string> => {
  try {
    const data = createEmployeeSchema.parse(input)
    const [db, { addDoc, collection }] = await Promise.all([
      getDb(),
      loadFirestoreSdk(),
    ])
    const document = await addDoc(collection(db, EMPLOYEES_COLLECTION), data)
    return document.id
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(INVALID_EMPLOYEE_MESSAGE, { code: 'validation' })
    }

    throw toAppError(error, 'Не удалось добавить сотрудника')
  }
}
