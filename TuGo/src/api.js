import axios from "axios";
import { API_URL } from "../constants";
import { useAuthState } from "./context/authContext";

export async function getAccounts() {
  return axios.get(`${API_URL}/api/accounts`);
}

export async function getAccountById(id) {
  return axios.get(`${API_URL}/api/accounts/${id}`);
}

export async function signUp(data) {
  return axios.post(`${API_URL}/signup/`, {
    username: data.username,
    email: data.email,
    name: data.name,
    password: data.password,
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

export async function getSelf(userToken) {
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.get(`${API_URL}/api/accounts/self/`, {
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  }
  return axios.get(`${API_URL}/api/accounts/self/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getFollowers(userToken, id) {
  console.log(userToken);
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.get(`${API_URL}/api/accounts/${id}/followers/`, {
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  }
  return axios.get(`${API_URL}/api/accounts/${id}/followers/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getFollowing(userToken, id) {
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.get(`${API_URL}/api/accounts/${id}/following/`, {
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  }
  return axios.get(`${API_URL}/api/accounts/${id}/following/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getPosts(userToken, id) {
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.get(`${API_URL}/api/accounts/${id}/posts/`, {
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  }
  return axios.get(`${API_URL}/api/accounts/${id}/posts/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}
