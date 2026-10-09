import { defineStore } from "pinia";
import { getUsers, getMe, updateBio, uploadAvatar, updatePassword } from "../api/userApi";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as any[],
    me: null as any,
    isLoading: false
  }),
  actions: {
    async asyncGetUsers() {
      this.isLoading = true;
      try {
        const response = await getUsers();
        this.users = response?.data || [];
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async asyncGetMe() {
      this.isLoading = true;
      try {
        const response = await getMe();
        this.me = response?.data;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async asyncUpdateBio(payload: Record<string, any>) {
      const res = await updateBio(payload);
      await this.asyncGetMe();
      return res;
    },
    async asyncUploadAvatar(file: File) {
      const res = await uploadAvatar(file);
      await this.asyncGetMe();
      return res;
    },
    async asyncUpdatePassword(payload: Record<string, any>) {
      return await updatePassword(payload);
    }
  }
});
