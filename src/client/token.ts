import { useState } from "react";

export function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) {
      return undefined;
    }
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: any) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  };
}

export function clearToken() {
  localStorage.clear();
}
