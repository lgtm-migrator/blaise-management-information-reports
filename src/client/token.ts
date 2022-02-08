import { useState } from "react";

type tokenManager = {
  setToken: (userToken: any) => void
  token: any
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function useToken(): tokenManager {
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

export function authHeader(): Record<string, string> {
  const token = getToken();
  if (!token) {
    return {};
  }

  return {
    authorization: token
  };
}
