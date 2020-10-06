import axios from "axios";
import { API_URL } from "../constants";
import { useAuthState } from "./context/authContext";

export async function getAccounts() {
  return axios.get(`${API_URL}/api/accounts`);
}

export async function getAccountById(id) {
  return axios.get(`${API_URL}/api/accounts/${id}`);
}

export async function createAccount(data) {
  return axios.post(`${API_URL}/api/accounts/`, {
    username: data.username,
    email: data.email,
    name: data.name,
  });
}

export async function signIn(data) {
  return axios.post(`${API_URL}/login/`, {
    username: data.username,
    password: data.password,
  });
}

export async function signOut(userToken) {
  console.log("userToken in api logout is: " + userToken);
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.get(`${API_URL}/logout/`, {
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  }
  return axios.get(`${API_URL}/logout/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}
