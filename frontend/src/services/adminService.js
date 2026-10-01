import api from './api';

const adminService = {
  getStats: () => api.get('/admin/stats'),
  getCategories: () => api.get('/admin/rag/categories'),
  getDocuments: () => api.get('/admin/rag/documents'),

  upload(categoryFolder, files) {
    const form = new FormData();
    form.append('categoryFolder', categoryFolder);
    [...files].forEach((f) => form.append('files', f));
    return api.post('/admin/rag/documents', form);
  },

  deleteDocument: (source) =>
    api.delete('/admin/rag/documents', { params: { source } }),
  getFilieres: () => api.get('/admin/rag/filieres'),
  createFiliere: (body) => api.post('/admin/rag/filieres', body),
  updateFiliere: (id, body) => api.put(`/admin/rag/filieres/${id}`, body),
  deleteFiliere: (id) => api.delete(`/admin/rag/filieres/${id}`),
  reindex: () => api.post('/admin/rag/reindex'),
  getReindexStatus: () => api.get('/admin/rag/reindex/status'),
};

export default adminService;
