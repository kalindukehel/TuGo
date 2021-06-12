export const playerReducer = (prevState, action) => {
  switch (action.type) {
    case "LOAD_VOICE":
      return {
        ...prevState,
        isPlaying: false,
        stopAll: false,
        voiceUrl: action.voiceUrl,
        playingId: action.id,
      };
    case "LOAD_PLAYER":
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
    case "SEEKING":
      return {
        ...prevState,
        isSeeking: true,
      };
    case "STOP_SEEKING":
      return {
        ...prevState,
        isSeeking: false,
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
    case "UNLOAD_VOICE":
      //Unloads the current soundObj
      const tempVoiceSoundObj = prevState.soundObj;
      tempVoiceSoundObj.unloadAsync();
      return {
        ...prevState,
        isPlaying: false,
        stopAll: true,
        voiceUrl: null,
        playingId: null,
      };
    default:
      return prevState;
  }
};
