import axios from "axios";
import { API_URL } from "../constants";

export async function getAccounts() {
  return axios.get(`${API_URL}/api/accounts`);
}

export async function getAccountById(id){
  return axios.get(`${API_URL}/api/accounts/${id}`);
}

export async function createAccount(data){
  return axios.post(`${API_URL}/api/accounts/`,{
    username: data.username,
    email: data.email,
    name: data.name
  })
}