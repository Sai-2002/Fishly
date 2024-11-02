// src/utils/sessionUtils.ts
export const isUserLoggedIn = (): boolean => {
    return sessionStorage.getItem("token") !== null;
  };