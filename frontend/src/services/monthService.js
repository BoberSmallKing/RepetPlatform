import api from "../api/api";

export const monthService = {
  list: (r_id) => api.get(`/relation/tutor-students/${r_id}/months/`),
  retrieve: (r_id, m_id) =>
    api.get(`/relation/tutor-students/${r_id}/months/${m_id}/`),
  create: (data, r_id) =>
    api.post(`/relation/tutor-students/${r_id}/months/`, data),
  update: (r_id, m_id, data) =>
    api.patch(`/relation/tutor-students/${r_id}/months/${m_id}/`, data),
  delete: (r_id, m_id) =>
    api.delete(`/relation/tutor-students/${r_id}/months/${m_id}/`),
};
