import axios from "axios";
import { API_URL } from "../constants";
import { useAuthState } from "./context/authContext";
import * as Notifications from "expo-notifications";

export async function getAccounts(token) {
  return axios.get(`${API_URL}/api/accounts/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function getAccountById(id, token) {
  return axios.get(`${API_URL}/api/accounts/${id}/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function viewableUsers(token) {
  return axios.get(`${API_URL}/api/accounts/viewable_users/`, {
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

export async function getPostTags(token, id) {
  return axios.get(`${API_URL}/api/posts/${id}/tags/`, {
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

export async function deleteComment(postId, commentId, token) {
  const data = {
    id: commentId
  }
  return axios.delete(`${API_URL}/api/posts/${postId}/comments/`, {
    headers: {
      Authorization: "Token " + token,
    },
    data: {
      id: commentId
    }
  });
}

export async function addTag(token, id, data) {
  return axios.post(`${API_URL}/api/posts/${id}/tags/`, data, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

export async function userLikes(token) {
  return axios.get(`${API_URL}/api/posts/liked/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

export async function searchPosts(token, query) {
  const data = {
    search_query: query
  }
  return axios.post(`${API_URL}/api/posts/search_by_post/`, data, {
    headers: {
      Authorization: "Token " + token,
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

export async function getExplorePosts(token) {
  return axios.get(`${API_URL}/api/accounts/explore/`, {
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

//check error for this
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
  let formdata = new FormData();
  formdata.append("profile_picture", {uri: data, name: 'image.jpg', type: 'image/jpeg'})
  return axios.patch(
    `${API_URL}/api/accounts/${id}/`,
    formdata,
    {
      headers: {
        Authorization: "Token " + token,
        "Content-Type": "multipart/form-data",
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

export async function pushNotification(expoPushToken, data, type) {
  let message;
  if (type == "like") {
    message = {
      to: expoPushToken,
      sound: "default",
      body: `${data.creator} liked your post`,
      data: { type: "like" },
    };
  } else if (type == "follow") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Follower",
      body: `${data.creator} started following you`,
      data: { type: "follow" },
    };
  } else if (type == "request") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Follower",
      body: `${data.creator} requested to following you`,
      data: { type: "request" },
    };
  } else if (type == "comment") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Comment",
      body: `${data.creator} commented on your post`,
      data: { type: "comment" },
    };
  } else if (type == "tag") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: "New Tag",
      body: `${data.creator} tagged you in a post`,
      data: { type: "tag" },
    };
  } else if (type == "message") {
    message = {
      to: expoPushToken,
      sound: "default",
      title: `${data.creator} sent you a message`,
      body: `${data.content}`,
      data: { type: "message" },
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

export async function deleteTile(postId, tileId, token) {
  return axios.delete(`${API_URL}/api/posts/${postId}/tiles/`, {
    headers: {
      Authorization: "Token " + token,
    },
    data: {
      id: tileId
    }
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

export async function editProfile(username, name, email, token) {
  let data = {
    username: username,
    name: name,
    email: email
  };
  if (username){
    data = {...data, username: username}
  }
  if (name){
    data = {...data, name: name}
  }
  console.log(data)
  return axios.patch(`${API_URL}/api/accounts/self/`, data, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

export async function isValidEmail(email) {
  return axios.post(`${API_URL}/valid/`, 
    {
      type: "email",
      email: email
    }  
    , {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function isValidUsername(username) {
  return axios.post(`${API_URL}/valid/`, 
    {
      type: "username",
      username: username
    }  
    , {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function isValidPassword(password) {
  return axios.post(`${API_URL}/valid/`, 
    {
      type: "password",
      password: password
    }  
    , {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

/* Non-Django API Functions */

export async function getYoutubeSearch(searchQuery) {
  return axios.get(
    "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" +
      searchQuery +
      "&key=AIzaSyB_h3y-lLNf7djjTiP4Kbzrkf1xzJPWgXI"
    //AIzaSyD4PveZNEi_D3PmpYuwJ8fub1zp65Clieg"
    //"&key=AIzaSyCP3Rb3_s9kW4MN1Huw_6j5NJ1QTHVyl54"
  );
}

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

export async function songSearch(searchQuery, token) {
  let data = {
    search_query: searchQuery,
  };
  return axios.post(`${API_URL}/api/songs/songsearch/`, data, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

//napster api
export async function getChartImage(playlistId) {
  return axios.get(
    `http://api.napster.com/v2.2/playlists/${playlistId}?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function getChartTracks(playlistId) {
  return axios.get(
    `http://api.napster.com/v2.2/playlists/${playlistId}/tracks?limit=100&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function getCharts() {
  return axios.get(
    `http://api.napster.com/v2.2/playlists/featured?limit=10&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function getAlbumImage(albumId) {
  return axios.get(
    `http://api.napster.com/v2.2/albums/${albumId}?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function getAlbumTracks(albumId) {
  return axios.get(
    `http://api.napster.com/v2.2/albums/${albumId}/tracks?limit=100&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function getNewAlbums() {
  return axios.get(
    `http://api.napster.com/v2.2/albums/new?limit=5&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function getTrackDetails(trackId) {
  return axios.get(
    `http://api.napster.com/v2.2/tracks/${trackId}?limit=100&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function songcharts(playlist_id, token) {
  let data = {
    playlist_id: playlist_id,
  };
  return axios.post(`${API_URL}/songcharts/`, data, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });
}

export async function typeSongAheadSearch(searchQuery) {
  return axios.get(
    `http://api.napster.com/v2.2/search?type=track&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&query=${searchQuery}`
  );
}

export async function searchArtist(searchQuery) {
  return axios.get(
    `http://api.napster.com/v2.2/search?type=artist&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&query=${searchQuery}&per_type_limit=1`
  );
}

export async function searchAlbum(searchQuery) {
  return axios.get(
    `http://api.napster.com/v2.2/search?type=album&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&query=${searchQuery}&per_type_limit=1`
  );
}

export async function fullTextSongSearch(searchQuery) {
  return axios.get(
    `http://api.napster.com/v2.2/search/verbose?type=track&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&query=${searchQuery}`
  );
}

export async function fullTextSearch(searchQuery) {
  return axios.get(
    `http://api.napster.com/v2.2/search/verbose?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&per_type_limit=4&query=${searchQuery}`
  );
}

export async function topFiveArtists() {
  return axios.get(
    `http://api.napster.com/v2.2/artists/top?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&limit=5&range=day`
  );
}

export async function topArtists() {
  return axios.get(
    `http://api.napster.com/v2.2/artists/top?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&limit=50`
  );
}

export async function artistSongsTop(id) {
  return axios.get(
    `http://api.napster.com/v2.2/artists/${id}/tracks/top?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&limit=50`
  );
}

export async function artistSongs(id) {
  return axios.get(
    `http://api.napster.com/v2.2/artists/${id}/tracks?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&limit=50`
  );
}

export async function getSimilarArtists(id) {
  return axios.get(
    `http://api.napster.com/v2.2/artists/${id}/similar?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3&limit=5&offset=10`
  );
}

export async function getArtistInfo(id) {
  return axios.get(
    `http://api.napster.com/v2.2/artists/${id}?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3`
  );
}

export async function createPost(caption, postDetails, tiles, token) {
  //Convert postDetails into an object to send as a request to api
  let postData = {
    caption: caption,
    album_cover: postDetails.coverArt,
    audio_url: postDetails.audioLink,
    song_name: postDetails.title,
    song_artist: postDetails.artist,
    song_tags:
      typeof postDetails.genre === "string" ||
      postDetails.genre instanceof String
        ? postDetails.genre
        : postDetails.genre.join(", "),
    song_id: postDetails.trackId,
    artist_id: postDetails.artistId,
    author: 2,
    video_count: tiles.length,
  };
  //Create post using postdata and store created object as res
  const res = await axios.post(`${API_URL}/api/posts/`, postData, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });

  //For every string (YouTube ID) sent in as tiles, create a tile under created object
  for (let i = 0; i < tiles.length; i++) {
    let tileData = {};
    if (tiles[i].is_youtube) {
      const videoId = tiles[i].video_id;
      const tileUrl = "https://www.youtube.com/watch?v=" + videoId;
      const tileThumbnail =
        "https://i.ytimg.com/vi/" + videoId + "/mqdefault.jpg";
      //Parse tileData from tile index
      tileData = {
        tile_type: "posted_choreo",
        is_youtube: tiles[i].is_youtube,
        youtube_link: tileUrl,
        image: tileThumbnail,
        view_count: 0,
        youtube_video_url: videoId,
      };
    } else {
      tileData = {
        tile_type: "posted_choreo",
        is_youtube: false,
        custom_video_url: tiles[i].uri,
        view_count: 0,
      };
    }
    //Create tile object under created post
    await axios.post(`${API_URL}/api/posts/${res.data.id}/tiles/`, tileData, {
      headers: {
        Authorization: "Token " + token,
        "Content-Type": "application/json",
      },
    });
  }
}

// Song lyrics api
export async function getSongLyrics(token, id) {
  await axios.get(`${API_URL}/api/posts/${id}/lyrics/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
}

// export async function songLyrics(artist, title) {
//   return axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}/`)
// }
