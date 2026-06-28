const API_BASE = '/api';

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ismeretlen hiba' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Transactions
export const getTransactions = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category_id) params.append('category_id', filters.category_id);
  if (filters.type) params.append('type', filters.type);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  const queryString = params.toString();
  return request(`/transactions${queryString ? '?' + queryString : ''}`);
};

export const getTransaction = (id) => request(`/transactions/${id}`);

export const createTransaction = (data) =>
  request('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateTransaction = (id, data) =>
  request(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteTransaction = (id) =>
  request(`/transactions/${id}`, {
    method: 'DELETE',
  });

// Categories
export const getCategories = (type) => {
  const params = type ? `?type=${type}` : '';
  return request(`/categories${params}`);
};

// Stats
export const getSummary = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  const queryString = params.toString();
  return request(`/stats/summary${queryString ? '?' + queryString : ''}`);
};

export const getCategoryStats = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  const queryString = params.toString();
  return request(`/stats/by-category${queryString ? '?' + queryString : ''}`);
};

export const getMonthlyStats = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  const queryString = params.toString();
  return request(`/stats/monthly${queryString ? '?' + queryString : ''}`);
};
