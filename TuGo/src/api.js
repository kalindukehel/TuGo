import axios from "axios";
import { API_URL } from "../constants";
import { useAuthState } from "./context/authContext";

export async function getAccounts() {
  return axios.get(`${API_URL}/api/accounts`);
}

export async function getAccountById(id, token) {
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

export async function signOut(token) {
  return axios.get(`${API_URL}/logout/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getSelf(token) {
  return axios.get(`${API_URL}/api/accounts/self/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getFollowers(token, id) {
  return axios.get(`${API_URL}/api/accounts/${id}/followers/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getFollowing(token, id) {
  return axios.get(`${API_URL}/api/accounts/${id}/following/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getRequests(token) {
  return axios.get(`${API_URL}/api/accounts/requests/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function manageRequest(data, token) {
  return axios.post(`${API_URL}/api/accounts/requests/`, data, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getRequested(token) {
  return axios.get(`${API_URL}/api/accounts/requested/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getPosts(token, id) {
  return axios.get(`${API_URL}/api/accounts/${id}/posts/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function by_ids(data, token) {
  let dic = {
    ids: data ? data : null,
  };
  return axios.post(`${API_URL}/api/accounts/by_ids/`, dic, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

export async function changeFollow(token, id) {
  return axios.post(`${API_URL}/api/accounts/${id}/followers/`, null, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

export async function getPostById(token, id) {
  return axios.get(`${API_URL}/api/posts/${id}/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getPostLikes(token, id) {
  return axios.get(`${API_URL}/api/posts/${id}/likes/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getPostComments(token, id) {
  return axios.get(`${API_URL}/api/posts/${id}/comments/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getPostTiles(token, id) {
  return axios.get(`${API_URL}/api/posts/${id}/tiles/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function likePost(token, id) {
  return axios.post(`${API_URL}/api/posts/${id}/likes/`, null, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function addComment(userToken, id, data) {
  let token = userToken;
  try {
    token = JSON.parse(token);
  } catch (e) {
    return axios.post(`${API_URL}/api/posts/${id}/comments/`, data, {
      headers: {
        Authorization: "Token " + userToken,
        "Content-Type": "application/json",
      },
    });
  }
  return axios.post(`${API_URL}/api/posts/${id}/comments/`, data, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

export async function getUserInfo(token, id) {
  return axios.get(`${API_URL}/api/accounts/${id}/details/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function setSoundCloudAudio(data, token, id) {
  return axios.patch(
    `${API_URL}/api/posts/${id}/`,
    {
      soundcloud_audio: data,
    },
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );
}

export async function getFeedPosts(token) {
  return axios.get(`${API_URL}/api/accounts/feed/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getPostFavorite(token, id) {
  return axios.get(`${API_URL}/api/posts/${id}/favorite/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function favoritePost(token, id) {
  console.log(token);
  return axios.post(`${API_URL}/api/posts/${id}/favorite/`, null, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getSavedSongs(token) {
  return axios.get(`${API_URL}/api/accounts/favorites/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getActivity(token) {
  return axios.get(`${API_URL}/api/accounts/activity/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}
