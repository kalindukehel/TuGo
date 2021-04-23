export const playerReducer = (prevState, action) => {
  switch (action.type) {
    case "LOAD_PLAYER":
      console.log(action.trackId);
      return {
        ...prevState,
        isPlaying: false,
        playingId: action.id,
        stopAll: false,
        url: action.url,
        trackId: action.trackId,
      };
    case "PLAY":
      return {
        ...prevState,
        isPlaying: true,
      };
    case "PAUSE":
      return {
        ...prevState,
        isPlaying: false,
      };
    case "UNLOAD_PLAYER":
      //Unloads the current soundObj
      const tempSoundObj = prevState.soundObj;
      tempSoundObj.unloadAsync();
      return {
        ...prevState,
        isPlaying: false,
        playingId: null,
        stopAll: true,
        url: null,
        trackId: null,
      };
    default:
      return prevState;
  }
};
