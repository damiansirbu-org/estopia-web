import { http, HttpResponse } from 'msw'

// API Response types matching the backend exactly
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  fieldErrors?: ApiFieldError[]
  errorId?: string
  timestamp?: string
  status?: number
  path?: string
  type?: string
}

interface ApiFieldError {
  field: string
  code: string
  message: string
}

interface ClientData {
  id: number
  name: string
  phoneNumber: string
  nationalId: string
  email?: string
  address?: string
  createdAt: string
  updatedAt: string
}

interface AssetData {
  id: number
  name: string
  address: string
  description?: string
  createdAt: string
  updatedAt: string
}

interface ContractData {
  id: number
  clientId: number
  assetId: number
  startDate: string
  endDate: string
  rentAmount: number
  amountDeposit: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface PaymentData {
  id: number
  assetId: number
  dueDate: string
  amountRent?: number
  amountTotal?: number
  paymentDate?: string
  amountPaid?: number
  createdAt: string
  updatedAt: string
}

// Mock data storage for CRUD operations
const mockData = {
  clients: new Map<number, ClientData>(),
  assets: new Map<number, AssetData>(),
  contracts: new Map<number, ContractData>(),
  payments: new Map<number, PaymentData>(),
  nextId: 1000
}

// Initialize some mock data
const initializeMockData = () => {
  if (mockData.clients.size === 0) {
    mockData.clients.set(1, generateMockClient(1))
    mockData.clients.set(2, generateMockClient(2))
    mockData.clients.set(3, generateMockClient(3))
    
    mockData.assets.set(1, generateMockAsset(1))
    mockData.assets.set(2, generateMockAsset(2))
    mockData.assets.set(3, generateMockAsset(3))
  }
}

// Mock data generators
const generateMockClient = (id: number, overrides: Partial<ClientData> = {}): ClientData => ({
  id,
  name: `Mock Client ${id}`,
  phoneNumber: `072100000${id}`,
  nationalId: `100000000000${id}`,
  email: `client${id}@mock.com`,
  address: `Mock Address ${id}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

const generateMockAsset = (id: number, overrides: Partial<AssetData> = {}): AssetData => ({
  id,
  name: `Mock Asset ${id}`,
  address: `Mock Asset Address ${id}`,
  description: `Mock asset for testing ${id}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

// Validation error generators matching backend format exactly
const generateValidationErrorResponse = (fieldErrors: ApiFieldError[]): ApiResponse<null> => ({
  success: false,
  data: null,
  type: 'VALIDATION_ERROR',
  status: 400,
  errorId: 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  timestamp: new Date().toISOString(),
  path: '/api/test',
  fieldErrors
})

export const handlers = [
  // Initialize mock data on first request
  http.get('http://localhost:8080/api/clients', () => {
    initializeMockData()
    const clients = Array.from(mockData.clients.values())
    return HttpResponse.json({ success: true, data: clients })
  }),

  // CLIENT CRUD OPERATIONS
  http.get('http://localhost:8080/api/clients/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const client = mockData.clients.get(id)
    if (!client) {
      return HttpResponse.json({ success: false, message: 'Client not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: client })
  }),

  http.post('http://localhost:8080/api/clients', async ({ request }) => {
    const body = await request.json() as Partial<ClientData>
    
    // Validate required fields exactly like backend YAVI validation
    const fieldErrors: ApiFieldError[] = []
    
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
      return HttpResponse.json(
        generateValidationErrorResponse(fieldErrors),
        { status: 400 }
      )
    }

    const newId = ++mockData.nextId
    const newClient = generateMockClient(newId, body)
    mockData.clients.set(newId, newClient)
    return HttpResponse.json({ success: true, data: newClient }, { status: 201 })
  }),

  http.put('http://localhost:8080/api/clients/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const body = await request.json() as Partial<ClientData>
    
    const existingClient = mockData.clients.get(id)
    if (!existingClient) {
      return HttpResponse.json({ success: false, message: 'Client not found' }, { status: 404 })
    }

    const updatedClient = { 
      ...existingClient, 
      ...body, 
      id, 
      updatedAt: new Date().toISOString() 
    }
    mockData.clients.set(id, updatedClient)
    return HttpResponse.json({ success: true, data: updatedClient })
  }),

  http.delete('http://localhost:8080/api/clients/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const deleted = mockData.clients.delete(id)
    if (!deleted) {
      return HttpResponse.json({ success: false, message: 'Client not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, message: 'Client deleted' })
  }),

  // ASSET CRUD OPERATIONS
  http.get('http://localhost:8080/api/assets', () => {
    initializeMockData()
    const assets = Array.from(mockData.assets.values())
    return HttpResponse.json({ success: true, data: assets })
  }),

  http.get('http://localhost:8080/api/assets/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const asset = mockData.assets.get(id)
    if (!asset) {
      return HttpResponse.json({ success: false, message: 'Asset not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: asset })
  }),

  http.post('http://localhost:8080/api/assets', async ({ request }) => {
    const body = await request.json() as Partial<AssetData>
    
    const fieldErrors: ApiFieldError[] = []
    
    if (!body.name || body.name.trim() === '') {
      fieldErrors.push({
        field: 'name',
        code: 'VALIDATION_ERROR',
        message: 'Name is required'
      })
    }
    
    if (!body.address || body.address.trim() === '') {
      fieldErrors.push({
        field: 'address',
        code: 'VALIDATION_ERROR',
        message: 'Address is required'
      })
    }

    if (fieldErrors.length > 0) {
      return HttpResponse.json(
        generateValidationErrorResponse(fieldErrors),
        { status: 400 }
      )
    }

    const newId = ++mockData.nextId
    const newAsset = generateMockAsset(newId, body)
    mockData.assets.set(newId, newAsset)
    return HttpResponse.json({ success: true, data: newAsset }, { status: 201 })
  }),

  http.put('http://localhost:8080/api/assets/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const body = await request.json() as Partial<AssetData>
    
    const existingAsset = mockData.assets.get(id)
    if (!existingAsset) {
      return HttpResponse.json({ success: false, message: 'Asset not found' }, { status: 404 })
    }

    const updatedAsset = { 
      ...existingAsset, 
      ...body, 
      id, 
      updatedAt: new Date().toISOString() 
    }
    mockData.assets.set(id, updatedAsset)
    return HttpResponse.json({ success: true, data: updatedAsset })
  }),

  http.delete('http://localhost:8080/api/assets/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const deleted = mockData.assets.delete(id)
    if (!deleted) {
      return HttpResponse.json({ success: false, message: 'Asset not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, message: 'Asset deleted' })
  }),

  // CONTRACT CRUD OPERATIONS
  http.get('http://localhost:8080/api/contracts', () => {
    const contracts = Array.from(mockData.contracts.values())
    return HttpResponse.json({ success: true, data: contracts })
  }),

  http.get('http://localhost:8080/api/contracts/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const contract = mockData.contracts.get(id)
    if (!contract) {
      return HttpResponse.json({ success: false, message: 'Contract not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: contract })
  }),

  http.post('http://localhost:8080/api/contracts', async ({ request }) => {
    const body = await request.json() as Partial<ContractData>
    
    const fieldErrors: ApiFieldError[] = []
    
    if (!body.clientId) {
      fieldErrors.push({
        field: 'clientId',
        code: 'VALIDATION_ERROR',
        message: 'Client ID is required'
      })
    }
    
    if (!body.assetId) {
      fieldErrors.push({
        field: 'assetId',
        code: 'VALIDATION_ERROR',
        message: 'Asset ID is required'
      })
    }
    
    if (!body.startDate) {
      fieldErrors.push({
        field: 'startDate',
        code: 'VALIDATION_ERROR',
        message: 'Start date is required'
      })
    }
    
    if (!body.endDate) {
      fieldErrors.push({
        field: 'endDate',
        code: 'VALIDATION_ERROR',
        message: 'End date is required'
      })
    }
    
    if (!body.rentAmount) {
      fieldErrors.push({
        field: 'rentAmount',
        code: 'VALIDATION_ERROR',
        message: 'Rent amount is required'
      })
    }
    
    if (!body.amountDeposit) {
      fieldErrors.push({
        field: 'amountDeposit',
        code: 'VALIDATION_ERROR',
        message: 'Deposit amount is required'
      })
    }

    if (fieldErrors.length > 0) {
      return HttpResponse.json(
        generateValidationErrorResponse(fieldErrors),
        { status: 400 }
      )
    }

    const newId = ++mockData.nextId
    const newContract: ContractData = {
      id: newId,
      clientId: body.clientId!,
      assetId: body.assetId!,
      startDate: body.startDate!,
      endDate: body.endDate!,
      rentAmount: body.rentAmount!,
      amountDeposit: body.amountDeposit!,
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.contracts.set(newId, newContract)
    return HttpResponse.json({ success: true, data: newContract }, { status: 201 })
  }),

  http.put('http://localhost:8080/api/contracts/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const body = await request.json() as Partial<ContractData>
    
    const existingContract = mockData.contracts.get(id)
    if (!existingContract) {
      return HttpResponse.json({ success: false, message: 'Contract not found' }, { status: 404 })
    }

    const updatedContract = { 
      ...existingContract, 
      ...body, 
      id, 
      updatedAt: new Date().toISOString() 
    }
    mockData.contracts.set(id, updatedContract)
    return HttpResponse.json({ success: true, data: updatedContract })
  }),

  http.delete('http://localhost:8080/api/contracts/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const deleted = mockData.contracts.delete(id)
    if (!deleted) {
      return HttpResponse.json({ success: false, message: 'Contract not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, message: 'Contract deleted' })
  }),

  // PAYMENT CRUD OPERATIONS
  http.get('http://localhost:8080/api/payments', () => {
    const payments = Array.from(mockData.payments.values())
    return HttpResponse.json({ success: true, data: payments })
  }),

  http.get('http://localhost:8080/api/payments/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const payment = mockData.payments.get(id)
    if (!payment) {
      return HttpResponse.json({ success: false, message: 'Payment not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: payment })
  }),

  http.post('http://localhost:8080/api/payments', async ({ request }) => {
    const body = await request.json() as Partial<PaymentData>
    
    const fieldErrors: ApiFieldError[] = []
    
    if (!body.assetId) {
      fieldErrors.push({
        field: 'assetId',
        code: 'VALIDATION_ERROR',
        message: 'Asset ID is required'
      })
    }
    
    if (!body.dueDate) {
      fieldErrors.push({
        field: 'dueDate',
        code: 'VALIDATION_ERROR',
        message: 'Due date is required'
      })
    }

    if (fieldErrors.length > 0) {
      return HttpResponse.json(
        generateValidationErrorResponse(fieldErrors),
        { status: 400 }
      )
    }

    const newId = ++mockData.nextId
    const newPayment: PaymentData = {
      id: newId,
      assetId: body.assetId!,
      dueDate: body.dueDate!,
      amountRent: body.amountRent,
      amountTotal: body.amountTotal ?? body.amountRent,
      paymentDate: body.paymentDate,
      amountPaid: body.amountPaid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.payments.set(newId, newPayment)
    return HttpResponse.json({ success: true, data: newPayment }, { status: 201 })
  }),

  http.put('http://localhost:8080/api/payments/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const body = await request.json() as Partial<PaymentData>
    
    const existingPayment = mockData.payments.get(id)
    if (!existingPayment) {
      return HttpResponse.json({ success: false, message: 'Payment not found' }, { status: 404 })
    }

    const updatedPayment = { 
      ...existingPayment, 
      ...body, 
      id, 
      updatedAt: new Date().toISOString() 
    }
    mockData.payments.set(id, updatedPayment)
    return HttpResponse.json({ success: true, data: updatedPayment })
  }),

  http.delete('http://localhost:8080/api/payments/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const deleted = mockData.payments.delete(id)
    if (!deleted) {
      return HttpResponse.json({ success: false, message: 'Payment not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, message: 'Payment deleted' })
  }),

  // Generic error handlers for non-existent endpoints
  http.all('*', () => {
    return HttpResponse.json(
      { 
        success: false, 
        message: 'API endpoint not found in MSW mocks',
        status: 404 
      },
      { status: 404 }
    )
  })
]