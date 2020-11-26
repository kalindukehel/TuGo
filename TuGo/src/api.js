import axios from "axios";
import { API_URL } from "../constants";
import { useAuthState } from "./context/authContext";

export async function getAccounts() {
  return axios.get(`${API_URL}/api/accounts`);
}

export async function getAccountById(id, userToken) {
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.get(`${API_URL}/api/accounts/${id}/`, {
      headers: {
        Authorization: "Token " + userToken,
      },
    });
  }
  return axios.get(`${API_URL}/api/accounts/${id}/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });   
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

export async function by_ids(data, userToken) {
  let token = userToken;
  console.log(data);
  let dic = {
    ids: data ? data : null
  }
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.post(`${API_URL}/api/accounts/by_ids/`,dic, {
      headers: {
        Authorization: "Token " + userToken,
        'Content-Type':'application/json',
      },
    });
  }
  console.log(token);
  return axios.post(`${API_URL}/api/accounts/by_ids/`,dic, {
    headers: {
      Authorization: "Token " + token,
      'Content-Type':'application/json',
    },
  });
}