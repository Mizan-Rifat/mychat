import { combineReducers } from "redux";
import SessionUserReducer from "../Ducks/SessionUserDuck";
import contactsReducer from "../Ducks/ContactsDuck";
import currentUsersReducer from "../Ducks/currentUsersDuck";
import recipientReducer from "../Ducks/recipientDuck";
import messagesReducer from "../Ducks/messagesDuck";

export const reducers = combineReducers({
    sessionUser : SessionUserReducer,
    contacts : contactsReducer,
    currentUsers: currentUsersReducer,
    recipient: recipientReducer,
    messages : messagesReducer,
})