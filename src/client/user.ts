import axios from "axios";
import { User } from "blaise-api-node-client";
import { ValidatedUser } from "../../server/handlers/loginHandler";

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

export async function validateUserPermissions(username: string): Promise<ValidatedUser> {
  const response = await axios.get(`/api/login/users/${username}/authorised`);

  return response.data;
}
