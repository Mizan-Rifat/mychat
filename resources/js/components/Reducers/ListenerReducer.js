export default (state, action) => {
  switch (action.type) {
    case "SET_TYPING":
      return {
        ...state,
        scroll: false,
        isTyping: action.payload,
      };
    case "SET_VISIBILITY":
      return {
        ...state,
        scroll: false,
        visibility: action.payload,
      };
    case "INIT_SCROLL":
      return {
        ...state,
        scroll: true,
      };
    case "INCOMING_MESSAGE":
      return {
        ...state,
        scroll: state.visibility ? true : false,
        newIncomingMsg: state.visibility ? false : true,
      };
    case "MESSAGE_SEND":
      return {
        ...state,
        scroll: state.visibility ? true : false,
      };
    case "SCROLL_TO_BOTTOM":
      return {
        ...state,
        scroll: true,
        newIncomingMsg: false,
      };
    case "INIT_STATE":
      return {
        ...state,
        isTyping: false,
        newIncomingMsg: false,
        scroll: false,
        visibility: true,
      };

    default:
      return state;
  }
};
