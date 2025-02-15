import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

interface TransactionSummary {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
    strokeWidth: number;
  }[];
}

interface TransactionParams {
  type?: string;
  search?: string;
  range?: string;
}

type Headers = {
  'Content-Type': string;
  Authorization?: string;
};

// API error handling utility
const handleApiError = (error: unknown, customMessage: string) => {
  console.error(`${customMessage}:`, error);
  throw error;
};

const getAuthHeader = async (): Promise<Headers> => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      try {
        console.log('Attempting login with:', credentials.email);
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Login failed:', data.error);
          throw new Error(data.error || 'Login failed');
        }
        
        console.log('Login successful');
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
  },
  transactions: {
    getAll: async (params?: TransactionParams) => {
      try {
        const headers = await getAuthHeader();
        const searchParams = new URLSearchParams();
        if (params?.type) searchParams.append('type', params.type);
        if (params?.search) searchParams.append('search', params.search);

        const url = `${API_URL}/transactions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        const response = await fetch(url, {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        handleApiError(error, 'Error fetching transactions');
      }
    },

    getSummary: async (range: string): Promise<TransactionSummary | undefined> => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_URL}/transactions/summary?range=${range}`, {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        handleApiError(error, 'Error fetching transaction summary');
      }
    },

    add: async (transaction: {
      name: string;
      amount: number;
      type: string;
      date: string;
    }) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        handleApiError(error, 'Error adding transaction');
      }
    },

    delete: async (id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: 'DELETE',
          headers,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        handleApiError(error, 'Error deleting transaction');
      }
    },
  },
}; 