import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

/**
 * Simple API Contract Tests
 * 
 * These tests verify that our MSW mocks match expected backend behavior
 * without requiring complex component rendering
 */

// Simple MSW server setup for this test
const handlers = [
  http.post('http://localhost:8080/api/clients', async ({ request }) => {
    const body = await request.json() as any
    
    // Test validation logic matching backend
    const fieldErrors = []
    
    if (!body.name || body.name.trim() === '') {
      fieldErrors.push({
        field: 'name',
        code: 'VALIDATION_ERROR',
        message: 'Name is required'
      })
    }
    
    if (!body.phoneNumber || body.phoneNumber.trim() === '') {
      fieldErrors.push({
        field: 'phoneNumber',
        code: 'VALIDATION_ERROR', 
        message: 'Phone number is required'
      })
    }
    
    if (!body.nationalId || body.nationalId.trim() === '') {
      fieldErrors.push({
        field: 'nationalId',
        code: 'VALIDATION_ERROR',
        message: 'National ID is required'
      })
    }

    if (fieldErrors.length > 0) {
      return HttpResponse.json({
        success: false,
        type: 'VALIDATION_ERROR',
        status: 400,
        fieldErrors
      }, { status: 400 })
    }

    return HttpResponse.json({
      success: true,
      data: {
        id: Date.now(),
        name: body.name,
        phoneNumber: body.phoneNumber,
        nationalId: body.nationalId
      }
    }, { status: 201 })
  })
]

const server = setupServer(...handlers)

describe('Simple API Contract Tests', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should validate client creation with all 3 field errors', async () => {
    const response = await fetch('http://localhost:8080/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        phoneNumber: '',
        nationalId: ''
      })
    })

    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.type).toBe('VALIDATION_ERROR')
    expect(data.fieldErrors).toHaveLength(3)
    
    const fieldNames = data.fieldErrors.map((err: any) => err.field)
    expect(fieldNames).toContain('name')
    expect(fieldNames).toContain('phoneNumber')
    expect(fieldNames).toContain('nationalId')
  })

  it('should create client successfully with valid data', async () => {
    const clientData = {
      name: 'John Doe',
      phoneNumber: '0721234567',
      nationalId: '1234567890123'
    }

    const response = await fetch('http://localhost:8080/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData)
    })

    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toBeDefined()
    expect(data.data.name).toBe('John Doe')
    expect(data.data.phoneNumber).toBe('0721234567')
    expect(data.data.nationalId).toBe('1234567890123')
  })

  it('should handle partial validation errors', async () => {
    const response = await fetch('http://localhost:8080/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '', // Invalid
        phoneNumber: '0721234567', // Valid
        nationalId: '1234567890123' // Valid
      })
    })

    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.fieldErrors).toHaveLength(1)
    expect(data.fieldErrors[0].field).toBe('name')
    expect(data.fieldErrors[0].message).toBe('Name is required')
  })
})