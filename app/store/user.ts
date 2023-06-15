import { create } from "zustand";

interface UserStore {
  loginStatus: boolean;

  phone: number;
  setPhone: (phone: number) => void;

  code: number;
  setCode: (code: number) => void;
}
export const useUserStore = create<UserStore>((set) => ({
  loginStatus: false,

  phone: 0,
  setPhone: (phone) => set({ phone: phone }),

  code: 0,
  setCode: (code) => set({ code: code }),
}));
