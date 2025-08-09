import { describe, it, expect, beforeEach } from 'vitest'

/**
 * Comprehensive CRUD Flow Tests for All Entities
 * 
 * Tests all Create, Read, Update, Delete operations for:
 * - Clients
 * - Assets  
 * - Contracts
 * - Payments
 * 
 * These tests use MSW to simulate real API interactions
 * and verify that frontend can handle all backend operations.
 */

describe('Comprehensive CRUD Flow Tests', () => {
  const BASE_URL = 'http://localhost:8080/api'

  // Test data generators
  const generateClientData = (overrides = {}) => ({
    name: 'Test Client',
    phoneNumber: '0721234567',
    nationalId: '1234567890123',
    email: 'test@example.com',
    address: 'Test Address',
    ...overrides
  })

  const generateAssetData = (overrides = {}) => ({
    name: 'Test Asset',
    address: 'Test Asset Address',
    description: 'Test asset description',
    ...overrides
  })

  const generateContractData = (clientId: number, assetId: number, overrides = {}) => ({
    clientId,
    assetId,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    rentAmount: 1000,
    amountDeposit: 1000,
    isActive: true,
    ...overrides
  })

  const generatePaymentData = (assetId: number, overrides = {}) => ({
    assetId,
    dueDate: '2024-02-01',
    amountRent: 1000,
    amountTotal: 1000,
    ...overrides
  })

  describe('Client CRUD Flows', () => {
    it('should complete full client CRUD cycle', async () => {
      // CREATE: Add new client
      const clientData = generateClientData({ name: 'John Doe' })
      
      let response = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })
      
      expect(response.status).toBe(201)
      const createResult = await response.json()
      expect(createResult.success).toBe(true)
      expect(createResult.data.name).toBe('John Doe')
      
      const clientId = createResult.data.id

      // READ: Get all clients
      response = await fetch(`${BASE_URL}/clients`)
      expect(response.status).toBe(200)
      const listResult = await response.json()
      expect(listResult.success).toBe(true)
      expect(Array.isArray(listResult.data)).toBe(true)
      expect(listResult.data.some((c: any) => c.id === clientId)).toBe(true)

      // READ: Get specific client
      response = await fetch(`${BASE_URL}/clients/${clientId}`)
      expect(response.status).toBe(200)
      const getResult = await response.json()
      expect(getResult.success).toBe(true)
      expect(getResult.data.id).toBe(clientId)
      expect(getResult.data.name).toBe('John Doe')

      // UPDATE: Modify client
      const updateData = { ...clientData, name: 'Jane Doe', email: 'jane@example.com' }
      response = await fetch(`${BASE_URL}/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      expect(response.status).toBe(200)
      const updateResult = await response.json()
      expect(updateResult.success).toBe(true)
      expect(updateResult.data.name).toBe('Jane Doe')
      expect(updateResult.data.email).toBe('jane@example.com')

      // DELETE: Remove client
      response = await fetch(`${BASE_URL}/clients/${clientId}`, {
        method: 'DELETE'
      })
      
      expect(response.status).toBe(200)
      const deleteResult = await response.json()
      expect(deleteResult.success).toBe(true)

      // Verify deletion
      response = await fetch(`${BASE_URL}/clients/${clientId}`)
      expect(response.status).toBe(404)
    })

    it('should validate client creation with multiple field errors', async () => {
      const invalidData = {
        name: '',
        phoneNumber: '',
        nationalId: ''
      }

      const response = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.status).toBe(400)
      const result = await response.json()
      expect(result.success).toBe(false)
      expect(result.fieldErrors).toHaveLength(3)
      
      const fieldNames = result.fieldErrors.map((e: any) => e.field)
      expect(fieldNames).toContain('name')
      expect(fieldNames).toContain('phoneNumber')
      expect(fieldNames).toContain('nationalId')
    })
  })

  describe('Asset CRUD Flows', () => {
    it('should complete full asset CRUD cycle', async () => {
      // CREATE: Add new asset
      const assetData = generateAssetData({ name: 'Luxury Apartment' })
      
      let response = await fetch(`${BASE_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      })
      
      expect(response.status).toBe(201)
      const createResult = await response.json()
      expect(createResult.success).toBe(true)
      expect(createResult.data.name).toBe('Luxury Apartment')
      
      const assetId = createResult.data.id

      // READ: Get all assets
      response = await fetch(`${BASE_URL}/assets`)
      expect(response.status).toBe(200)
      const listResult = await response.json()
      expect(listResult.success).toBe(true)
      expect(Array.isArray(listResult.data)).toBe(true)

      // READ: Get specific asset
      response = await fetch(`${BASE_URL}/assets/${assetId}`)
      expect(response.status).toBe(200)
      const getResult = await response.json()
      expect(getResult.success).toBe(true)
      expect(getResult.data.name).toBe('Luxury Apartment')

      // UPDATE: Modify asset
      const updateData = { ...assetData, name: 'Updated Apartment', description: 'Newly renovated' }
      response = await fetch(`${BASE_URL}/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      expect(response.status).toBe(200)
      const updateResult = await response.json()
      expect(updateResult.success).toBe(true)
      expect(updateResult.data.name).toBe('Updated Apartment')
      expect(updateResult.data.description).toBe('Newly renovated')

      // DELETE: Remove asset
      response = await fetch(`${BASE_URL}/assets/${assetId}`, {
        method: 'DELETE'
      })
      
      expect(response.status).toBe(200)
      const deleteResult = await response.json()
      expect(deleteResult.success).toBe(true)

      // Verify deletion
      response = await fetch(`${BASE_URL}/assets/${assetId}`)
      expect(response.status).toBe(404)
    })

    it('should validate asset creation with required fields', async () => {
      const invalidData = {
        name: '',
        address: ''
      }

      const response = await fetch(`${BASE_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.status).toBe(400)
      const result = await response.json()
      expect(result.success).toBe(false)
      expect(result.fieldErrors).toHaveLength(2)
      
      const fieldNames = result.fieldErrors.map((e: any) => e.field)
      expect(fieldNames).toContain('name')
      expect(fieldNames).toContain('address')
    })
  })

  describe('Contract CRUD Flows', () => {
    let clientId: number
    let assetId: number

    beforeEach(async () => {
      // Create dependencies for contract tests
      const clientResponse = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateClientData({ name: 'Contract Client' }))
      })
      clientId = (await clientResponse.json()).data.id

      const assetResponse = await fetch(`${BASE_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateAssetData({ name: 'Contract Asset' }))
      })
      assetId = (await assetResponse.json()).data.id
    })

    it('should complete full contract CRUD cycle', async () => {
      // CREATE: Add new contract
      const contractData = generateContractData(clientId, assetId)
      
      let response = await fetch(`${BASE_URL}/contracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData)
      })
      
      expect(response.status).toBe(201)
      const createResult = await response.json()
      expect(createResult.success).toBe(true)
      expect(createResult.data.clientId).toBe(clientId)
      expect(createResult.data.assetId).toBe(assetId)
      expect(createResult.data.rentAmount).toBe(1000)
      
      const contractId = createResult.data.id

      // READ: Get all contracts
      response = await fetch(`${BASE_URL}/contracts`)
      expect(response.status).toBe(200)
      const listResult = await response.json()
      expect(listResult.success).toBe(true)
      expect(Array.isArray(listResult.data)).toBe(true)

      // READ: Get specific contract
      response = await fetch(`${BASE_URL}/contracts/${contractId}`)
      expect(response.status).toBe(200)
      const getResult = await response.json()
      expect(getResult.success).toBe(true)
      expect(getResult.data.id).toBe(contractId)

      // UPDATE: Modify contract
      const updateData = { ...contractData, rentAmount: 1200, isActive: false }
      response = await fetch(`${BASE_URL}/contracts/${contractId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      expect(response.status).toBe(200)
      const updateResult = await response.json()
      expect(updateResult.success).toBe(true)
      expect(updateResult.data.rentAmount).toBe(1200)
      expect(updateResult.data.isActive).toBe(false)

      // DELETE: Remove contract
      response = await fetch(`${BASE_URL}/contracts/${contractId}`, {
        method: 'DELETE'
      })
      
      expect(response.status).toBe(200)
      const deleteResult = await response.json()
      expect(deleteResult.success).toBe(true)

      // Verify deletion
      response = await fetch(`${BASE_URL}/contracts/${contractId}`)
      expect(response.status).toBe(404)
    })

    it('should validate contract creation with all 6 required fields', async () => {
      const invalidData = {
        clientId: null,
        assetId: null,
        startDate: '',
        endDate: '',
        rentAmount: null,
        amountDeposit: null
      }

      const response = await fetch(`${BASE_URL}/contracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.status).toBe(400)
      const result = await response.json()
      expect(result.success).toBe(false)
      expect(result.fieldErrors).toHaveLength(6)
      
      const fieldNames = result.fieldErrors.map((e: any) => e.field)
      expect(fieldNames).toContain('clientId')
      expect(fieldNames).toContain('assetId')
      expect(fieldNames).toContain('startDate')
      expect(fieldNames).toContain('endDate')
      expect(fieldNames).toContain('rentAmount')
      expect(fieldNames).toContain('amountDeposit')
    })
  })

  describe('Payment CRUD Flows', () => {
    let assetId: number

    beforeEach(async () => {
      // Create asset dependency for payment tests
      const assetResponse = await fetch(`${BASE_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateAssetData({ name: 'Payment Asset' }))
      })
      assetId = (await assetResponse.json()).data.id
    })

    it('should complete full payment CRUD cycle', async () => {
      // CREATE: Add new payment
      const paymentData = generatePaymentData(assetId)
      
      let response = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })
      
      expect(response.status).toBe(201)
      const createResult = await response.json()
      expect(createResult.success).toBe(true)
      expect(createResult.data.assetId).toBe(assetId)
      expect(createResult.data.dueDate).toBe('2024-02-01')
      
      const paymentId = createResult.data.id

      // READ: Get all payments
      response = await fetch(`${BASE_URL}/payments`)
      expect(response.status).toBe(200)
      const listResult = await response.json()
      expect(listResult.success).toBe(true)
      expect(Array.isArray(listResult.data)).toBe(true)

      // READ: Get specific payment
      response = await fetch(`${BASE_URL}/payments/${paymentId}`)
      expect(response.status).toBe(200)
      const getResult = await response.json()
      expect(getResult.success).toBe(true)
      expect(getResult.data.id).toBe(paymentId)

      // UPDATE: Modify payment
      const updateData = { 
        ...paymentData, 
        amountRent: 1200,
        paymentDate: '2024-02-05',
        amountPaid: 600
      }
      response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      expect(response.status).toBe(200)
      const updateResult = await response.json()
      expect(updateResult.success).toBe(true)
      expect(updateResult.data.amountRent).toBe(1200)
      expect(updateResult.data.amountPaid).toBe(600)

      // DELETE: Remove payment
      response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
        method: 'DELETE'
      })
      
      expect(response.status).toBe(200)
      const deleteResult = await response.json()
      expect(deleteResult.success).toBe(true)

      // Verify deletion
      response = await fetch(`${BASE_URL}/payments/${paymentId}`)
      expect(response.status).toBe(404)
    })

    it('should validate payment creation with required fields', async () => {
      const invalidData = {
        assetId: null,
        dueDate: ''
      }

      const response = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.status).toBe(400)
      const result = await response.json()
      expect(result.success).toBe(false)
      expect(result.fieldErrors).toHaveLength(2)
      
      const fieldNames = result.fieldErrors.map((e: any) => e.field)
      expect(fieldNames).toContain('assetId')
      expect(fieldNames).toContain('dueDate')
    })
  })

  describe('Cross-Entity Integration Flows', () => {
    it('should create complete business flow: Client → Asset → Contract → Payment', async () => {
      // Step 1: Create Client
      const clientResponse = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateClientData({ name: 'Integration Client' }))
      })
      expect(clientResponse.status).toBe(201)
      const client = (await clientResponse.json()).data

      // Step 2: Create Asset
      const assetResponse = await fetch(`${BASE_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateAssetData({ name: 'Integration Asset' }))
      })
      expect(assetResponse.status).toBe(201)
      const asset = (await assetResponse.json()).data

      // Step 3: Create Contract linking Client and Asset
      const contractResponse = await fetch(`${BASE_URL}/contracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateContractData(client.id, asset.id))
      })
      expect(contractResponse.status).toBe(201)
      const contract = (await contractResponse.json()).data

      // Step 4: Create Payment for the Asset
      const paymentResponse = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatePaymentData(asset.id))
      })
      expect(paymentResponse.status).toBe(201)
      const payment = (await paymentResponse.json()).data

      // Verify all entities are properly linked
      expect(contract.clientId).toBe(client.id)
      expect(contract.assetId).toBe(asset.id)
      expect(payment.assetId).toBe(asset.id)

      // Test cascading operations (update contract affects linked entities conceptually)
      const contractUpdateResponse = await fetch(`${BASE_URL}/contracts/${contract.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...generateContractData(client.id, asset.id), rentAmount: 1500 })
      })
      expect(contractUpdateResponse.status).toBe(200)
      const updatedContract = (await contractUpdateResponse.json()).data
      expect(updatedContract.rentAmount).toBe(1500)
    })

    it('should handle 404 errors for non-existent resources', async () => {
      // Test 404 for each entity type
      const entities = ['clients', 'assets', 'contracts', 'payments']
      
      for (const entity of entities) {
        const response = await fetch(`${BASE_URL}/${entity}/99999`)
        expect(response.status).toBe(404)
        const result = await response.json()
        expect(result.success).toBe(false)
      }
    })

    it('should handle invalid API endpoints', async () => {
      const response = await fetch(`${BASE_URL}/nonexistent`)
      expect(response.status).toBe(404)
      const result = await response.json()
      expect(result.success).toBe(false)
      expect(result.message).toContain('not found')
    })
  })
})