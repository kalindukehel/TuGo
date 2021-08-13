import React from "react";
import { tilePlayerReducer } from "../reducers/tilePlayerReducer";

const TilePlayerStateContext = React.createContext();
const TilePlayerDispatchContext = React.createContext();

const TilePlayerProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(tilePlayerReducer, {
    id: '',
    isActive: false
  });
  return (
    <TilePlayerStateContext.Provider value={state}>
      <TilePlayerDispatchContext.Provider value={dispatch}>{children}</TilePlayerDispatchContext.Provider>
    </TilePlayerStateContext.Provider>
  );
};

const useTilePlayerState = () => {
  const context = React.useContext(TilePlayerStateContext);
  if (context === undefined) {
    throw new Error("useTilePlayerState must be used within a TilePlayerProvider");
  }
  return context;
};

const useTilePlayerDispatch = () => {
  const context = React.useContext(TilePlayerDispatchContext);
  if (context === undefined) {
    throw new Error("useTilePlayerDispatch must be used within a TilePlayerProvider");
  }
  return context;
};

export { TilePlayerProvider, useTilePlayerState, useTilePlayerDispatch };
