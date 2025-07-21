const API_BASE_URL = 'http://localhost:8080/api';

export const clientService = {
  async getAllClients() {
    const response = await fetch(`${API_BASE_URL}/clients`);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  },

  async createClient(client) {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    return response.json();
  },

  async updateClient(id, client) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to update client');
    }
    return response.json();
  },

  async deleteClient(id) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete client');
    }
  }
};