// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3005";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,

  // Patients
  PATIENTS: `${API_BASE_URL}/api/patients`,

  // Master Data
  POLYCLINICS: `${API_BASE_URL}/api/master/polys`,
  DOCTORS: `${API_BASE_URL}/api/master/doctors`,

  // Registrations
  REGISTRATIONS: `${API_BASE_URL}/api/registrations`,

  // Pharmacy
  MEDICINES: `${API_BASE_URL}/api/pharmacy/medicines`,
  DISPENSE: `${API_BASE_URL}/api/pharmacy/dispense`,

  // Doctor
  DOCTOR_QUEUE: `${API_BASE_URL}/api/doctor/queue`,
  DOCTOR_EXAMINE: `${API_BASE_URL}/api/doctor/examine`,
  MEDICAL_RECORDS: `${API_BASE_URL}/api/doctor/records`,

  // Inpatient
  INPATIENT_ADMIT: `${API_BASE_URL}/api/inpatient/admit`,
  INPATIENT_DISCHARGE: `${API_BASE_URL}/api/inpatient/discharge`,
  INPATIENT: `${API_BASE_URL}/api/inpatient/admissions`,

  // Billing
  BILLING_GENERATE: `${API_BASE_URL}/api/billing/generate`,
  BILLING_PAY: `${API_BASE_URL}/api/billing/pay`,
  BILLING: `${API_BASE_URL}/api/billing/all`,
};

// User Management API functions
export const userAPI = {
  // Get all users
  getUsers: () => fetch(API_ENDPOINTS.USERS, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Get user by ID
  getUser: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Create new user
  createUser: (userData) => fetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(res => res.json()),

  // Update user
  updateUser: (id, userData) => fetch(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(res => res.json()),

  // Delete user
  deleteUser: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Reset user password
  resetPassword: (id, password) => fetch(`${API_ENDPOINTS.USERS}/${id}/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  }).then(res => res.json()),

  // Reset password to default
  resetPasswordToDefault: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}/reset-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Toggle user active status
  toggleUserStatus: (id, isActive) => fetch(`${API_ENDPOINTS.USERS}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_active: isActive }),
  }).then(res => res.json()),

  // Get user activity logs
  getUserActivityLogs: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}/activity-logs`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Get user statistics
  getUserStats: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),
};
// User Management API functions
export const userAPI = {
  // Get all users
  getUsers: () => fetch(API_ENDPOINTS.USERS, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Get user by ID
  getUser: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Create new user
  createUser: (userData) => fetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(res => res.json()),

  // Update user
  updateUser: (id, userData) => fetch(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(res => res.json()),

  // Delete user
  deleteUser: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Reset user password
  resetPassword: (id, password) => fetch(`${API_ENDPOINTS.USERS}/${id}/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  }).then(res => res.json()),

  // Reset password to default
  resetPasswordToDefault: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}/reset-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Toggle user active status
  toggleUserStatus: (id, isActive) => fetch(`${API_ENDPOINTS.USERS}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_active: isActive }),
  }).then(res => res.json()),

  // Get user activity logs
  getUserActivityLogs: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}/activity-logs`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),

  // Get user statistics
  getUserStats: (id) => fetch(`${API_ENDPOINTS.USERS}/${id}/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()),
};

  export default API_BASE_URL;
 
