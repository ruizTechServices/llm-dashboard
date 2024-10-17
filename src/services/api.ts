import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chrome-24hourgpt-5bb1bcb92d7e.herokuapp.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export const mistralApi = {
  chat: (userMessage: string) => api.post('/mistral/chatbot', { userMessage }),
};

export const gpt4Api = {
  chat: (userMessage: string) => api.post('/gpt4/chatbot', { userMessage }),
};

export const gpt4oApi = {
  chat: (userMessage: string) => api.post('/gpt4o/chatbot', { userMessage }),
};

export const uploadApi = {
  uploadFile: (file: File, newFileName: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('newFileName', newFileName);
    return api.post('/upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const retrieveApi = {
  getFile: (folderTitle: string, fileTitle: string) => 
    api.get(`/retrieve/retrieve/${folderTitle}/${fileTitle}`),
};