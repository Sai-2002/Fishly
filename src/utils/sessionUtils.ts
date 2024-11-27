// src/utils/sessionUtils.ts
export const isUserLoggedIn = (): boolean => {
    return localStorage.getItem("token") !== null;
  };