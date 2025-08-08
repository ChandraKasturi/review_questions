import axios, { AxiosResponse } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  FetchQuestionsRequest,
  FetchQuestionsResponse,
  UpdateQuestionRequest,
  UpdateQuestionResponse,
} from '@/types';

const API_BASE_URL = 'http://localhost:80';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('x-auth-session');
  if (token) {
    config.headers['X-Auth-Session'] = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<{ response: LoginResponse; token: string }> => {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${API_BASE_URL}/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      }
    );
    
    const token = response.headers['x-auth-session'];
    if (!token) {
      throw new Error('No auth token received');
    }
    
    return {
      response: response.data,
      token,
    };
  },
};

// Questions API
export const questionsAPI = {
  fetchQuestions: async (params: FetchQuestionsRequest): Promise<FetchQuestionsResponse> => {
    const response: AxiosResponse<FetchQuestionsResponse> = await api.post(
      '/api/learn/questions/fetch',
      params
    );
    return response.data;
  },

  updateQuestion: async (questionData: UpdateQuestionRequest): Promise<UpdateQuestionResponse> => {
    const response: AxiosResponse<UpdateQuestionResponse> = await api.put(
      '/api/learn/questions/update',
      questionData
    );
    return response.data;
  },
};

export default api;