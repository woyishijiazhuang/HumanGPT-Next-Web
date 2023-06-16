import { create } from "zustand";

interface UserStore {
  token: string;
  setToken: (token: string) => void;

  phone: string;
  setPhone: (phone: string) => void;

  code: string;
  setCode: (code: string) => void;

  loginButton: boolean;
  setLoginButton: (b: boolean) => void;

  chatnum: number;
  setChatnum: (num: number) => void;

  vipType: string;
  setVipType: (num: string) => void;
}
export const useUserStore = create<UserStore>((set) => ({
  token: "",
  setToken: (token) => set({ token: token }),

  phone: "",
  setPhone: (phone) => set({ phone: phone }),

  code: "",
  setCode: (code) => set({ code: code }),

  loginButton: true,
  setLoginButton: (b) => set({ loginButton: b }),

  chatnum: 0,
  setChatnum: (num) => set({ chatnum: num }),

  vipType: "0",
  setVipType: (s) => set({ vipType: s }),
}));
