import { configureStore } from "@reduxjs/toolkit";
import { problemReducer, profileReducer, userReducer,nearbyUserReducer, reviewReducer, applicationReducer, notificationReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducer.js';
import { chatReducer } from "./reducers/chatReducer.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    profile : profileReducer,
    problems : problemReducer,
    nearbyUsers: nearbyUserReducer,
    reviews : reviewReducer,
    applications : applicationReducer,
    notifications : notificationReducer,
    chat: chatReducer,
    forgotPassword : forgotPasswordReducer,
    allUsers : allUsersReducer,
    userDetails: userDetailsReducer

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
