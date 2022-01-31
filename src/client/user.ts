import axios from "axios";
import { User } from "blaise-api-node-client";

export async function getUser(username: string): Promise<User> {
  const response = await axios.get(`/api/login/users/${username}`);

  return response.data;
}

export async function validatePassword(username: string, password: string): Promise<boolean> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const response = await axios.post("/api/login/users/password/validate", formData);

  return response.data;
}
