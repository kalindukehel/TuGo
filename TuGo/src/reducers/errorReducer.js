export const errorReducer = (prevState, action) => {
    switch (action.type) {
      case "REPORT_ERROR":
        return {
          ...prevState,
          errorMessage: action.message,
          isError: true,
        };
      case "CLEAR_ERROR":
        return {
          ...prevState,
          errorMessage: '',
          isError: false,
        };
      default:
        return prevState;
    }
  };
  