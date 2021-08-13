export const tilePlayerReducer = (prevState, action) => {
  console.log(action.type)
    switch (action.type) {
      case "SHOW_TILE":
        return {
          ...prevState,
          id: action.id,
          isActive: true,
        };
      case "REMOVE_TILE":
        return {
          ...prevState,
          id: '',
          isActive: false,
        };
      default:
        return prevState;
    }
  };
  