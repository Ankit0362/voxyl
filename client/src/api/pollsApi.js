import api from './axios';

export const pollsApi = {
  createPoll: (data) => api.post('/polls/create', data),
  getMyPolls: () => api.get('/polls/my-polls'),
  getPollById: (pollId) => api.get(`/polls/${pollId}`),
  updatePoll: (pollId, data) => api.put(`/polls/${pollId}`, data),
  deletePoll: (pollId) => api.delete(`/polls/${pollId}`),
  publishPoll: (pollId) => api.post(`/polls/${pollId}/publish`)
};
