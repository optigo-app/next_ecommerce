"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartCountNum, setCartCountNum] = useState(0);
  const [wishCountNum, setWishCountNum] = useState(0);
  const [loginUserDetail, setLoginUserDetail] = useState(null);
  const [islogin, setislogin] = useState(true);
  const [cartOpenStateB2C, setCartOpenStateB2C] = useState(false);

  useEffect(() => {
    const storedDetail = sessionStorage.getItem("loginUserDetail");
    if (storedDetail) {
      const parsed = JSON.parse(storedDetail);
      setLoginUserDetail(parsed);
      setislogin(true);
    }
  }, []);


  const value = {
    user,
    setUser,
    islogin,
    cartCountNum,
    setCartCountNum,
    wishCountNum,
    setWishCountNum,
    setislogin,
    loginUserDetail,
    setLoginUserDetail,
    cartOpenStateB2C,
    setCartOpenStateB2C,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}