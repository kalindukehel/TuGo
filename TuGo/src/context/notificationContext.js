import React from "react";
import { notificationReducer } from "../reducers/notificationReducer";

const NotificationStateContext = React.createContext();
const NotificationDispatchContext = React.createContext();

const NotificationProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(notificationReducer, {
    unread: false,
  });
  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
};

const useNotificationState = () => {
  const context = React.useContext(NotificationStateContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationState must be used within a NotificationProvider"
    );
  }
  return context;
};

const useNotificationDispatch = () => {
  const context = React.useContext(NotificationDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationDispatch must be used within a NotificationProvider"
    );
  }
  return context;
};

export { NotificationProvider, useNotificationState, useNotificationDispatch };
