import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/auth';

export const registerUser = async (data) => {
  return axios.post(`${API_BASE}/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_BASE}/login`, data);
};
