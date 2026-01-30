import api from "../api/api";

export const relationService = {
  list: () => api.get("/relation/tutor-students/"),
  retrieve: (id) => api.get(`/relation/tutor-students/${id}/`),
  create: (data) => api.post("/relation/tutor-students/", data),
  update: (id, data) => api.patch(`/relation/tutor-students/${id}/`, data),
  delete: (id) => api.delete(`/relation/tutor-students/${id}/`),
};
