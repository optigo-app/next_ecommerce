"use client";
import { create } from "zustand";

export const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  cartCountNum: 0,
  setCartCountNum: (count) => set({ cartCountNum: count }),

  wishCountNum: 0,
  setWishCountNum: (count) => set({ wishCountNum: count }),

  loginUserDetail: null,
  setLoginUserDetail: (detail) => {
    sessionStorage.setItem("loginUserDetail", JSON.stringify(detail));
    set({ loginUserDetail: detail, islogin: true });
  },

  islogin: false,
  setislogin: (value) => set({ islogin: value }),

  initLoginUserDetail: () => {
    const storedDetail = sessionStorage.getItem("loginUserDetail");
    if (storedDetail) {
      const parsed = JSON.parse(storedDetail);
      set({ loginUserDetail: parsed, islogin: true });
    }
  },
}));
