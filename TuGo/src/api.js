import axios from "axios";
import { API_URL } from "../constants";
import { useAuthState } from "./context/authContext";
import * as Notifications from "expo-notifications";

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

export async function postNotificationToken(data, token, id) {
  return axios.patch(
    `${API_URL}/api/accounts/${id}/`,
    {
      notification_token: data,
    },
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );
}

export async function postProfilePicture(data, token, id) {
  return axios.patch(
    `${API_URL}/api/accounts/${id}/`,
    {
      profile_picture: data,
    },
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );
}

export async function deleteNotificationToken(token, id) {
  return axios.patch(
    `${API_URL}/api/accounts/${id}/`,
    {
      notification_token: null,
    },
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );
}

/* Push Notification functions */

export async function pushNotification(expoPushToken, creator, type) {
  let message;
  if (type == "like") {
    message = {
      to: expoPushToken,
      sound: "default",
      body: `${creator} liked your post`,
      data: { type: "like" },
    };
  } else if (type == "follow") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Follower",
      body: `${creator} started following you`,
      data: { type: "follow" },
    };
  } else if (type == "request") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Follower",
      body: `${creator} requested to following you`,
      data: { type: "request" },
    };
  } else if (type == "comment") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Comment",
      body: `${creator} commented on your post`,
      data: { type: "comment" },
    };
  }
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export async function deletePost(postId, token) {
  return axios.delete(`${API_URL}/api/posts/${postId}/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function toggleAccountVisilibity(isPrivate, token) {
  let data = {
    is_private: isPrivate,
  };
  return axios.patch(`${API_URL}/api/accounts/self/`, data, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

/* Non-Django API Functions */

export async function getAudioLink(soundCloudLink) {
  return axios.get(
    soundCloudLink + "?client_id=3DLVBKZxoYMm5gFm9YjFxJTNFL0VECz7"
  );
}

export async function getSoundCloudSearch(searchQuery) {
  return axios.get(
    "https://api-v2.soundcloud.com/search?q=" +
      searchQuery +
      "&variant_ids=&facet=model&user_id=448421-41791-230292-46720&client_id=3DLVBKZxoYMm5gFm9YjFxJTNFL0VECz7&limit=20&offset=0&linked_partitioning=1&app_version=1607696603&app_locale=en"
  );
}

export async function getSoundCloudSuggestions(searchQuery) {
  return axios.get(
    "https://api-v2.soundcloud.com/search/queries?q=" +
      searchQuery +
      "&client_id=3DLVBKZxoYMm5gFm9YjFxJTNFL0VECz7&limit=10&offset=0&linked_partitioning=1&app_version=1609942767&app_locale=en"
  );
}

export async function getYoutubeSearch(searchQuery) {
  return axios.get(
    "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" +
      searchQuery +
      "&key=AIzaSyD4PveZNEi_D3PmpYuwJ8fub1zp65Clieg"
    //"&key=AIzaSyCP3Rb3_s9kW4MN1Huw_6j5NJ1QTHVyl54"
  );
}

export async function createPost(caption, postDetails, tiles, token) {
  //Convert postDetails into an object to send as a request to api
  let postData = {
    caption: caption,
    soundcloud_art: postDetails.coverArt,
    soundcloud_audio: postDetails.audioLink,
    soundcloud_search_query: postDetails.title + " " + postDetails.artist,
    song_name: postDetails.title,
    song_artist: postDetails.artist,
    author: 2,
  };
  console.log(postData);
  //Create post using postdata and store created object as res
  const res = await axios.post(`${API_URL}/api/posts/`, postData, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });

  //For every string (YouTube ID) sent in as tiles, create a tile under created object
  for (let i = 0; i < tiles.length; i++) {
    const tileUrl = "https://www.youtube.com/watch?v=" + tiles[i];
    const tileThumbnail =
      "https://i.ytimg.com/vi/" + tiles[i] + "/mqdefault.jpg";

    //Parse tileData from tile index
    const tileData = {
      tile_type: "posted_choreo",
      is_youtube: true,
      link: tileUrl,
      image: tileThumbnail,
      view_count: 0,
      post: 0,
    };

    //Create tile object under created post
    await axios.post(`${API_URL}/api/posts/${res.data.id}/tiles/`, tileData, {
      headers: {
        Authorization: "Token " + token,
        "Content-Type": "application/json",
      },
    });
  }
}

//Song lyrics api
// export async function getSongLyrics(lyricsQuery) {
//   console.log(lyricsQuery);
//   return axios.get(`https://api.lyrics.ovh/v1/${lyricsQuery}`);
// }
