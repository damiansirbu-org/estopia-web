// Async wrapper for API calls
export const apiCall = async (apiFunction) => {
  try {
    const response = await apiFunction();

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }

    // Handle empty responses (like DELETE operations returning 204)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};