import api from './axiosInstance';

export const createPoll = (data) => api.post('/api/polls/create', data);
export const listPolls = () => api.get('/api/polls/my-polls');
export const getPoll = (id) => api.get(`/api/polls/${id}`);
export const deletePoll = (id) => api.delete(`/api/polls/${id}`);
export const publishPoll = (id) => api.post(`/api/polls/${id}/publish`);
export const closePoll = (id) => api.put(`/api/polls/${id}`, { isExpired: true }); 
export const getPublicPoll = (shareId) => api.get(`/api/public/poll/${shareId}`);
export const submitResponse = (shareId, data) => api.post(`/api/public/poll/${shareId}/respond`, data);
export const getAnalytics = (id) => api.get(`/api/analytics/${id}/summary`);
export const getPublicResults = (shareId) => api.get(`/api/public/poll/${shareId}`); 
