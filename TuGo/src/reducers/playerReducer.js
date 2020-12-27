export const playerReducer = (prevState, action) => {
  switch (action.type) {
    case "LOAD_PLAYER":
      return {
        ...prevState,
        isPlaying: false,
        playingId: action.id,
        stopAll: false,
      };
    case "UNLOAD_PLAYER":
      return {
        ...prevState,
        isPlaying: false,
        playingId: null,
        stopAll: true,
      };
    default:
      return prevState;
  }
};
