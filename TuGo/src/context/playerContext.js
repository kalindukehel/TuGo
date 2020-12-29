import React from "react";
import { playerReducer } from "../reducers/playerReducer";
import { Audio } from "expo-av";

const PlayerStateContext = React.createContext();
const PlayerDispatchContext = React.createContext();

const PlayerProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(playerReducer, {
    isPlaying: false,
    playingId: null,
    stopAll: false,
    soundObj: new Audio.Sound(),
  });
  return (
    <PlayerStateContext.Provider value={state}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerStateContext.Provider>
  );
};

const usePlayerState = () => {
  const context = React.useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error("usePlayerState must be used within an AuthProvider");
  }
  return context;
};

const usePlayerDispatch = () => {
  const context = React.useContext(PlayerDispatchContext);
  if (context === undefined) {
    throw new Error("usePlayerDispatch must be used within an AuthProvider");
  }
  return context;
};

export { PlayerProvider, usePlayerState, usePlayerDispatch };
