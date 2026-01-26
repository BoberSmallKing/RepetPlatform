import api from "../api/api";

const authService = {
  async login(credentials) {
    const response = await api.post("auth/login/", credentials);

    const { access, refresh, user } = response.data;

    if (access && refresh) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    }

    return user;
  },
  async register(payload) {
    const response = await api.post("auth/register/", payload);
    return response.data;
  },
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem("access_token"));
  },

  async getMe() {
    const response = await api.get("auth/profile/");
    return response.data;
  },

  async resetPassword(email) {
    return api.post("auth/password-reset/", { email });
  },

  async resetPasswordConfirm(uid, token, passwords) {
    const response = await api.post(
      `auth/password-reset-confirm/${uid}/${token}/`,
      passwords
    );
    return response.data;
  },

  async refreshToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      throw new Error("No refresh token");
    }

    const response = await api.post("token/refresh/", { refresh });

    const { access } = response.data;
    localStorage.setItem("access_token", access);

    return access;
  },

  forceLogout() {
    this.logout();
    window.location.href = "/login";
  },
};

export default authService;
