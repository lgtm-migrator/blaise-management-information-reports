import { useState } from "react";

type tokenManager = {
  setToken: (userToken: any) => void
  token: any
}

export function useToken(): tokenManager {
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: any) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  };
}

export function clearToken(): void {
  localStorage.clear();
}
