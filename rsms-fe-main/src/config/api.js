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

export default API_BASE_URL;
