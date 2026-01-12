const API_BASE_URL = 'http://localhost:8080/api';

// API client with enhanced error handling
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log('Making API call to:', url, 'with body:', options.body);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('Response status:', response.status);
    
    // Try to get the response text first
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      // Try to parse as JSON for error details
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If not JSON, use the text as is
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse successful response as JSON
    try {
      return JSON.parse(responseText);
    } catch (e) {
      // If response is not JSON, return as text
      return responseText;
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials: { phone: string; password: string }) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string; 
    userType?: string 
  }) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...userData, userType: userData.userType || 'simple' }),
    }),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: (userId: string) =>
    apiClient(`/dashboard/summary?userId=${userId}`),

  getSuggestions: (userId: string) =>
    apiClient(`/dashboard/suggestions?userId=${userId}`),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (userId: string) =>
    apiClient(`/transactions?userId=${userId}`),

  getRecentTransactions: (userId: string) =>
    apiClient(`/transactions/recent?userId=${userId}`),

  createTransaction: (transaction: any) =>
    apiClient('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),

  updateTransaction: (id: string, transaction: any) =>
    apiClient(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    }),

  deleteTransaction: (id: string) =>
    apiClient(`/transactions/${id}`, {
      method: 'DELETE',
    }),
};

// Bills API
export const billsAPI = {
  getBills: (userId: string) =>
    apiClient(`/bills?userId=${userId}`),

  getUpcomingBills: (userId: string) =>
    apiClient(`/bills/upcoming?userId=${userId}`),

  getOverdueBills: (userId: string) =>
    apiClient(`/bills/overdue?userId=${userId}`),

  createBill: (bill: any) =>
    apiClient('/bills', {
      method: 'POST',
      body: JSON.stringify(bill),
    }),

  updateBill: (id: string, bill: any) =>
    apiClient(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bill),
    }),

  markBillAsPaid: (id: string) =>
    apiClient(`/bills/${id}/pay`, {
      method: 'PUT',
    }),

  deleteBill: (id: string) =>
    apiClient(`/bills/${id}`, {
      method: 'DELETE',
    }),
};

// Budgets API
export const budgetsAPI = {
  getBudgets: (userId: string) => apiClient(`/budgets?userId=${userId}`),
  createBudget: (budget: any) => apiClient('/budgets', { method: 'POST', body: JSON.stringify(budget) }),
  updateBudget: (id: string, budget: any) => apiClient(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(budget) }),
  deleteBudget: (id: string) => apiClient(`/budgets/${id}`, { method: 'DELETE' }),
};

// Accounts API
export const accountsAPI = {
  getAccounts: (userId: string) => apiClient(`/accounts?userId=${userId}`),
  createAccount: (account: any) => apiClient('/accounts', { method: 'POST', body: JSON.stringify(account) }),
  updateAccount: (id: string, account: any) => apiClient(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(account) }),
  deleteAccount: (id: string) => apiClient(`/accounts/${id}`, { method: 'DELETE' }),
};

// Goals API
export const goalsAPI = {
  getGoals: (userId: string) =>
    apiClient(`/goals?userId=${userId}`),

  createGoal: (goal: any) =>
    apiClient('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    }),

  updateGoal: (id: string, goal: any) =>
    apiClient(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    }),

  deleteGoal: (id: string) =>
    apiClient(`/goals/${id}`, {
      method: 'DELETE',
    }),
};

// Settings API
export const settingsAPI = {
  getSettings: (userId: string) =>
    apiClient(`/settings?userId=${userId}`),

  updateSettings: (userId: string, settings: any) =>
    apiClient(`/settings?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  resetSettings: (userId: string) =>
    apiClient(`/settings/reset?userId=${userId}`, {
      method: 'POST',
    }),

  deleteSettings: (userId: string) =>
    apiClient(`/settings?userId=${userId}`, {
      method: 'DELETE',
    }),
};

// User Profile API
export const userAPI = {
  updateProfile: (userId: string, userData: any) =>
    apiClient(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  getProfile: (userId: string) =>
    apiClient(`/users/${userId}`),
};

// AI API
export const aiAPI = {
  getInsights: (userId: string) =>
    apiClient(`/ai/insights?userId=${userId}`),

  chat: (userId: string, message: string) =>
    apiClient(`/ai/chat?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};