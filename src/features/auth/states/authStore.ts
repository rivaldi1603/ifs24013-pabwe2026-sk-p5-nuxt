import { defineStore } from "pinia";
import { login, register } from "../api/authApi";
import { removeAccessToken } from "../../../helpers/apiHelper";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null as any | null,
    isLogin: false,
    isRegister: false,
  }),
  actions: {
    async asyncLogin(payload: Record<string, any>) {
      this.isLogin = true;
      try {
        const response = await login(payload);
        return response;
      } finally {
        this.isLogin = false;
      }
    },
    async asyncRegister(payload: Record<string, any>) {
      this.isRegister = true;
      try {
        const response = await register(payload);
        return response;
      } finally {
        this.isRegister = false;
      }
    },
    logout() {
      this.authUser = null;
      removeAccessToken();
    },
  },
});
