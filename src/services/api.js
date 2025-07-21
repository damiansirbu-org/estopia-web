import { apiCall } from '../utils/errorHandler.js';

const API_BASE_URL = 'http://localhost:8080/api';

export const clientService = {
  async getAllClients() {
    return apiCall(() => 
      fetch(`${API_BASE_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  },

  async createClient(client) {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      })
    );
  },

  async updateClient(id, client) {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      })
    );
  },

  async deleteClient(id) {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
};