export const notificationReducer = (prevState, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...prevState,
        unread: action.unread,
      };
    default:
      return prevState;
  }
};
