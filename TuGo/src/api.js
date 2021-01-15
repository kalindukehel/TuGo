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

export async function addComment(token, id, data) {
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

export async function searchUsers(data, token) {
  let dic = {
    search_query: data ? data : null,
  };
  return axios.post(`${API_URL}/api/accounts/search_by_username/`, dic, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

/* Non-Django API Functions */

export async function getAudioLink(soundCloudLink) {
  return axios.get(
    soundCloudLink + "?client_id=dwEyLDp7xWIqlUI1M2YxPnIXGtBhtsia"
  );
}

export async function getSoundCloudSearch(searchQuery) {
  return axios.get(
    "https://api-v2.soundcloud.com/search?q=" +
      searchQuery +
      "&variant_ids=&facet=model&user_id=448421-41791-230292-46720&client_id=dwEyLDp7xWIqlUI1M2YxPnIXGtBhtsia&limit=20&offset=0&linked_partitioning=1&app_version=1607696603&app_locale=en"
  );
}

export async function getSoundCloudSuggestions(searchQuery) {
  return axios.get(
    "https://api-v2.soundcloud.com/search/queries?q=" +
      searchQuery +
      "&client_id=dwEyLDp7xWIqlUI1M2YxPnIXGtBhtsia&limit=10&offset=0&linked_partitioning=1&app_version=1609942767&app_locale=en"
  );
}
