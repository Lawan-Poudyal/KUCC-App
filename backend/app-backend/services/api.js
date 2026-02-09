import { useAuth } from "@clerk/clerk-expo";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// And add validation
if (!API_URL) {
  console.error('❌ EXPO_PUBLIC_API_URL is not defined in .env file');
}

/**
 * Custom hook to make authenticated API calls
 * This ensures the Clerk JWT token is sent with every request
 */
export const useApi = () => {
  const { getToken } = useAuth();

  const apiCall = async (endpoint, options = {}) => {
    try {
      // Get the Clerk session token
      const token = await getToken();

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Make the request with the token
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return {
    // Get user profile
    getProfile: () => apiCall('/api/user/profile'),

    // Sync user to database
    syncUser: () => apiCall('/api/user/sync', { method: 'POST' }),

    // Get user's items
    getMyItems: () => apiCall('/api/data/my-items'),

    // Create new item
    createItem: (data) => apiCall('/api/data/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    // Generic API call for custom endpoints
    call: apiCall,
  };
};

/**
 * Non-hook version for use outside of components
 */
export const createApiClient = (getToken) => {
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return {
    getProfile: () => apiCall('/api/user/profile'),
    syncUser: () => apiCall('/api/user/sync', { method: 'POST' }),
    getMyItems: () => apiCall('/api/data/my-items'),
    createItem: (data) => apiCall('/api/data/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    call: apiCall,
  };
};