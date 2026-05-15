import api from './axios';

export const publicApi = {
  getPollByToken: (shareToken) => api.get(`/public/poll/${shareToken}`),
  submitResponse: (shareToken, data) => api.post(`/public/poll/${shareToken}/respond`, data)
};
