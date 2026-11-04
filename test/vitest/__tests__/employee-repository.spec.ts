import { beforeEach, describe, expect, it, vi } from 'vitest'

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn((_db: unknown, name: string) => ({ name })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
}))
vi.mock('firebase/firestore', () => firestoreMocks)

import {
  createEmployee,
  EMPLOYEES_COLLECTION,
  listEmployees,
} from '@/features/employees'
import { AppError } from '@/shared/lib/errors'

type RawDocument = {
  id: string
  data: Record<string, unknown>
}

const makeSnapshot = (documents: RawDocument[]) => ({
  docs: documents.map((document) => ({
    id: document.id,
    data: () => document.data,
  })),
})

beforeEach(() => {
  firestoreMocks.getDocs.mockReset()
  firestoreMocks.addDoc.mockReset()
  firestoreMocks.collection.mockClear()
})

describe('employeeRepository', () => {
  it('reads employees, coerces string rates and skips malformed documents', async () => {
    firestoreMocks.getDocs.mockResolvedValue(
      makeSnapshot([
        {
          id: '1',
          data: {
            name: 'Ada Lovelace',
            email: 'ada@example.com',
            position: 'Engineer',
            level: 'Senior',
            description: 'First programmer',
            rate: '5',
          },
        },
        {
          id: '2',
          data: {
            name: 'Grace Hopper',
            email: 'grace@example.com',
            position: 'Engineer',
            level: 'Lead',
            rate: 4,
          },
        },
        {
          id: 'broken',
          data: {
            email: 'broken@example.com',
            position: 'Engineer',
            level: 'Lead',
            rate: 'not-a-number',
          },
        },
      ])
    )

    const employees = await listEmployees()

    expect(firestoreMocks.collection).toHaveBeenCalledWith(
      {},
      EMPLOYEES_COLLECTION
    )
    expect(employees).toEqual([
      {
        id: '1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        position: 'Engineer',
        level: 'Senior',
        description: 'First programmer',
        rate: 5,
      },
      {
        id: '2',
        name: 'Grace Hopper',
        email: 'grace@example.com',
        position: 'Engineer',
        level: 'Lead',
        description: '',
        rate: 4,
      },
    ])
  })

  it('returns an empty list for an empty collection', async () => {
    firestoreMocks.getDocs.mockResolvedValue(makeSnapshot([]))

    await expect(listEmployees()).resolves.toEqual([])
  })

  it('wraps read errors into a readable AppError', async () => {
    firestoreMocks.getDocs.mockRejectedValue({ code: 'permission-denied' })

    await expect(listEmployees()).rejects.toMatchObject({
      name: 'AppError',
      message: 'Недостаточно прав для выполнения операции',
      code: 'permission-denied',
    })
    await expect(listEmployees()).rejects.toBeInstanceOf(AppError)
  })

  it('creates an employee with a numeric rate and returns the new id', async () => {
    firestoreMocks.addDoc.mockResolvedValue({ id: 'new-employee-id' })

    const id = await createEmployee({
      name: '  Ada Lovelace  ',
      email: 'ada@example.com',
      position: 'Engineer',
      level: 'Senior',
      rate: '5',
      description: 'First programmer',
    })

    expect(id).toBe('new-employee-id')
    expect(firestoreMocks.collection).toHaveBeenCalledWith(
      {},
      EMPLOYEES_COLLECTION
    )
    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
      { name: EMPLOYEES_COLLECTION },
      {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        position: 'Engineer',
        level: 'Senior',
        description: 'First programmer',
        rate: 5,
      }
    )
  })

  it('defaults an omitted description to an empty string', async () => {
    firestoreMocks.addDoc.mockResolvedValue({ id: 'id' })

    await createEmployee({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      position: 'Engineer',
      level: 'Senior',
      rate: 5,
    })

    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ description: '' })
    )
  })

  it('rejects invalid input before writing to Firestore', async () => {
    await expect(
      createEmployee({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        position: 'Engineer',
        level: 'Senior',
        rate: 'not-a-number',
      })
    ).rejects.toMatchObject({
      name: 'AppError',
      message: 'Проверьте заполнение полей сотрудника',
    })

    expect(firestoreMocks.addDoc).not.toHaveBeenCalled()
  })

  it('rejects an empty or out-of-range rating', async () => {
    const validInput = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      position: 'Engineer',
      level: 'Senior',
    }

    await expect(
      createEmployee({ ...validInput, rate: '' })
    ).rejects.toBeInstanceOf(AppError)
    await expect(
      createEmployee({ ...validInput, rate: 6 })
    ).rejects.toBeInstanceOf(AppError)

    expect(firestoreMocks.addDoc).not.toHaveBeenCalled()
  })
})
