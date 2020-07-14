import axios from "axios";
import { API_URL } from "../constants";

export async function getAccounts() {
  return axios.get(`${API_URL}api/v1/accounts`);
}
