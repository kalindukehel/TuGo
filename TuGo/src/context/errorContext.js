import React from "react";
import { errorReducer } from "../reducers/errorReducer";

const ErrorStateContext = React.createContext();
const ErrorDispatchContext = React.createContext();

const ErrorProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(errorReducer, {
    errorMessage: '',
    isError: false
  });
  return (
    <ErrorStateContext.Provider value={state}>
      <ErrorDispatchContext.Provider value={dispatch}>{children}</ErrorDispatchContext.Provider>
    </ErrorStateContext.Provider>
  );
};

const useErrorState = () => {
  const context = React.useContext(ErrorStateContext);
  if (context === undefined) {
    throw new Error("useErrorState must be used within a ErrorProvider");
  }
  return context;
};

const useErrorDispatch = () => {
  const context = React.useContext(ErrorDispatchContext);
  if (context === undefined) {
    throw new Error("useErrorDispatch must be used within a ErrorProvider");
  }
  return context;
};

export { ErrorProvider, useErrorState, useErrorDispatch };
