import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (data) => axios.post('http://127.0.0.1:8000/api/users/register/', data);
export const loginUser = (data) => axios.post('http://127.0.0.1:8000/api/users/login/', data);
export const googleLogin = (data) => axios.post('http://127.0.0.1:8000/api/users/google/', data);
export const getProfile = () => API.get('/users/profile/');

export const getMedicalRecord = () => API.get('/users/medical-record/');
export const updateMedicalRecord = (data) => API.post('/users/medical-record/', data);
export const getMedicalDocuments = () => API.get('/users/medical-documents/');
export const createMedicalDocument = (formData) => API.post('/users/medical-documents/', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const deleteMedicalDocument = (id) => API.delete(`/users/medical-documents/${id}/`);

// Dashboard & Advanced API calls
export const aiTriage = (data) => API.post('/users/ai-triage/', data);
export const getEstablishments = () => API.get('/users/establishments/');
export const createEstablishment = (data) => API.post('/users/establishments/', data);
export const getDoctors = () => API.get('/users/doctors/');
export const getMyDoctorProfile = () => API.get('/users/doctors/?me=true');
export const updateDoctorProfile = (formData) => API.post('/users/doctors/', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const verifyDoctor = (id, status, rejectionReason = '') => 
    API.post(`/users/doctors/${id}/verify/`, { status, rejection_reason: rejectionReason });

export const getAppointments = () => API.get('/users/appointments/');
export const createAppointment = (data) => API.post('/users/appointments/', data);
export const updateAppointment = (data) => API.put('/users/appointments/', data);

export const getMedicalNotes = (patientId) => API.get(`/users/medical-notes/?patient_id=${patientId}`);
export const createMedicalNote = (data) => API.post('/users/medical-notes/', data);

export const getReports = () => API.get('/users/reports/');
export const createReport = (data) => API.post('/users/reports/', data);
export const updateReport = (data) => API.put('/users/reports/', data);

export const getAdminAnalytics = () => API.get('/users/admin-analytics/');
export const getAdminUsers = () => API.get('/users/admin-users/');
export const updateAdminUser = (data) => API.put('/users/admin-users/', data);

export const getWomensHealthProfile = () => API.get('/users/womens-health/');
export const updateWomensHealthProfile = (data) => API.post('/users/womens-health/', data);
export const getCycleLogs = () => API.get('/users/cycle-logs/');
export const createCycleLog = (data) => API.post('/users/cycle-logs/', data);

export default API;