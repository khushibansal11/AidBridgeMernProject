import { createReducer } from '@reduxjs/toolkit';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  CLEAR_ERRORS,
  COMPLETE_PROFILE_REQUEST,
  COMPLETE_PROFILE_SUCCESS,
  COMPLETE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_RESET,
  CREATE_PROBLEM_REQUEST,
  CREATE_PROBLEM_SUCCESS,
  CREATE_PROBLEM_FAIL,
  CREATE_PROBLEM_RESET,
  DELETE_PROBLEM_SUCCESS,
  DELETE_PROBLEM_FAIL,
  CHANGE_PROBLEM_STATUS_SUCCESS,
  CHANGE_PROBLEM_STATUS_FAIL,
  CLEAR_MESSAGES,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD_RESET,
  ADD_SKILL_REQUEST,
  ADD_SKILL_SUCCESS,
  ADD_SKILL_FAIL,
  ADD_SKILL_RESET,
  LOAD_OTHER_USER_SUCCESS,
  LOAD_OTHER_USER_REQUEST,
  LOAD_OTHER_USER_FAIL,
  NEARBY_USER_REQUEST,
  NEARBY_USER_SUCCESS,
  NEARBY_USER_FAIL,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAIL,
  APPLY_PROBLEM_REQUEST,
  APPLY_PROBLEM_SUCCESS,
  APPLY_PROBLEM_FAIL,
  GET_USER_PROBLEM_DETAILS_REQUEST,
  GET_USER_PROBLEM_DETAILS_SUCCESS,
  GET_USER_PROBLEM_DETAILS_FAIL,
  ADD_NOTIFICATION_REQUEST,
  ADD_NOTIFICATION_SUCCESS,
  ADD_NOTIFICATION_FAIL,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAIL,
  REJECT_NOTIFICATION_REQUEST,
  REJECT_NOTIFICATION_SUCCESS,
  REJECT_NOTIFICATION_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_RESET,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_RESET,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,

} from '../constants/userConstants.js';

const initialUserState = {loading:true, user: {}, user2: {} };

export const userReducer = createReducer(initialUserState, (builder) => {
  builder

    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
      state.user2 = {};
    })
    .addCase(LOGOUT_SUCCESS, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(LOGOUT_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(LOAD_USER_FAIL, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    })
    .addCase(COMPLETE_PROFILE_REQUEST, (state) => {
      state.loading = true;
      state.user = { ...state.user };
    })
    .addCase(LOAD_OTHER_USER_REQUEST, (state) => {
      state.loading = true;
      state.user = { ...state.user };
    })
    .addCase(LOAD_OTHER_USER_SUCCESS, (state, action) => {
      state.loading = false;
      state.user2 = action.payload;
    })
    .addCase(LOAD_OTHER_USER_FAIL, (state, action) => {
      state.loading = false;
      state.user2 = null;
      state.error = action.payload;
    })
    .addCase(COMPLETE_PROFILE_SUCCESS, (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
    })
    .addCase(COMPLETE_PROFILE_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;

    })

    .addMatcher(
      action => [LOGIN_REQUEST, REGISTER_REQUEST, LOAD_USER_REQUEST].includes(action.type),
      state => {
        state.loading = true;
        state.isAuthenticated = false;
      }
    )
    .addMatcher(
      action => [LOGIN_SUCCESS, REGISTER_SUCCESS, LOAD_USER_SUCCESS].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      }
    )
    .addMatcher(
      action => [LOGIN_FAIL, REGISTER_FAIL].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      }
    );

});

const initialProfileState = { loading: false, error: null };

export const profileReducer = createReducer(initialProfileState, (builder) => {
  builder
  
  .addCase(CLEAR_ERRORS, (state) => {
    state.error = null;
    state.isUpdated = false;
  })
    .addCase(UPDATE_PROFILE_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(UPDATE_PROFILE_SUCCESS, (state, action) => {
      state.loading = false;
      // state.user = { ...state.user, ...action.payload };
      state.isUpdated = action.payload;
    })
    .addCase(UPDATE_PROFILE_RESET, (state, action) => {
      state.loading = false;
      state.isUpdated = false;
    })
    .addCase(CHANGE_PASSWORD_RESET, (state,) => {
      state.loading = false;
      state.isPasswordChanged = false;
    })
    .addCase(CHANGE_PASSWORD_REQUEST, (state) => {
      state.loading = true;
      state.isPasswordChanged = false;
    })
    .addCase(CHANGE_PASSWORD_SUCCESS, (state, action) => {
      state.loading = false;
      state.isPasswordChanged = true;
    })
    .addCase(ADD_SKILL_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(ADD_SKILL_SUCCESS, (state, action) => {
      state.loading = false;
      state.isSkillAdded = action.payload;
    })
    .addCase(ADD_SKILL_RESET, (state) => {
      state.isSkillAdded = false;
    })
    .addCase(DELETE_USER_SUCCESS, (state,action) => {
      state.loading= false;
      state.isDeleted= action.payload.success;
      state.message= action.payload.message;
    })
    .addCase(DELETE_USER_RESET, (state,action) => {
      state.isDeleted= false;
    })
    .addCase(UPDATE_USER_SUCCESS, (state,action) => {
      state.loading = false;
        state.isUpdated = action.payload;
    })
    .addCase(UPDATE_USER_RESET, (state,action) => {
      state.isUpdated = false;
    })
    .addMatcher(
      (action) => [DELETE_USER_REQUEST,UPDATE_USER_REQUEST].includes(action.type),
      (state) => {
        state.loading= true;
      }
    )
    .addMatcher(
      (action) => [CHANGE_PASSWORD_FAIL,UPDATE_PROFILE_FAIL,ADD_SKILL_FAIL,DELETE_USER_FAIL,UPDATE_USER_FAIL].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    )
});

const initialProblemState = { loading: false, error: null };
export const problemReducer = createReducer(initialProblemState, (builder) => {
  builder
    .addCase(CLEAR_MESSAGES, (state) => {
      state.message = null;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
      state.isUpdated = false;
    })
    .addCase(CREATE_PROBLEM_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(CREATE_PROBLEM_SUCCESS, (state, action) => {
      state.loading = false;
      state.isCreated = action.payload;
    })
    .addCase(CREATE_PROBLEM_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CREATE_PROBLEM_RESET, (state) => {
      state.isCreated = false;
    })
    .addMatcher((action) => [DELETE_PROBLEM_SUCCESS, CHANGE_PROBLEM_STATUS_SUCCESS].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.message = action.payload;
      }
    )
    .addMatcher(
      action => [DELETE_PROBLEM_FAIL, CHANGE_PROBLEM_STATUS_FAIL].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    )
});

const initialNearbyState = { loading: false, error: null, users: [] };
export const nearbyUserReducer = createReducer(initialNearbyState, (builder) => {
  builder
    .addCase(NEARBY_USER_REQUEST, (state) => {
      state.loading = true;
      state.users = [];
      state.error = null;
    })
    .addCase(NEARBY_USER_SUCCESS, (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    })
    .addCase(NEARBY_USER_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});

const initialReviewState = { loading: false, error: null, success: false };

export const reviewReducer = createReducer(initialReviewState, (builder) => {
  builder
    .addCase(CREATE_REVIEW_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(CREATE_REVIEW_SUCCESS, (state, action) => {
      state.loading = false;
      state.success = action.payload;
    })
    .addCase(CREATE_REVIEW_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
      state.success = false;
    });
});

const initialapplicationState = { loading: false, error: null, isApplied : false ,applicationDetails: [] };

export const applicationReducer = createReducer(initialapplicationState, (builder) => {
  builder
    .addCase(APPLY_PROBLEM_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(APPLY_PROBLEM_SUCCESS, (state, action) => {
      state.loading = false;
      state.error = null;
      state.isApplied = action.payload;
    })
    .addCase(APPLY_PROBLEM_FAIL, (state, action) => {
      state.loading = false;
      state.isApplied = false;
      state.error = action.payload;
    })
    .addCase(GET_USER_PROBLEM_DETAILS_REQUEST, (state, action) => {
      state.loading = true;
      state.applicationDetails = []
    })
    .addCase(GET_USER_PROBLEM_DETAILS_SUCCESS, (state, action) => {
      state.loading = false;
      state.error = null;
      state.applicationDetails = action.payload ? [...state.applicationDetails, action.payload] : state.applicationDetails;
    })
    .addCase(GET_USER_PROBLEM_DETAILS_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
    });
});

const initialNotificationState = {notifications: [], loading: false,error: null,success: false};

export const notificationReducer = createReducer(initialNotificationState, (builder) => {
  builder
    
    .addCase(ADD_NOTIFICATION_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(ADD_NOTIFICATION_SUCCESS, (state, action) => {
      state.loading = false;
      state.success = action.payload;
    })
    .addCase(ADD_NOTIFICATION_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(FETCH_NOTIFICATIONS_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(FETCH_NOTIFICATIONS_SUCCESS, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    })
    .addCase(FETCH_NOTIFICATIONS_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(REJECT_NOTIFICATION_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(REJECT_NOTIFICATION_SUCCESS, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(REJECT_NOTIFICATION_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
      state.success = false;
    });
});

const initialForgotPasswordUserState = {};

export const forgotPasswordReducer = createReducer(initialForgotPasswordUserState, (builder) => {
  builder
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
    })
    .addCase(RESET_PASSWORD_SUCCESS, (state,action) => {
      state.loding = false;
      state.success = action.payload;
    })
    .addMatcher(
      (action) => [FORGOT_PASSWORD_REQUEST,RESET_PASSWORD_REQUEST].includes(action.type),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    )
    .addMatcher(
      (action) => [FORGOT_PASSWORD_SUCCESS].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.message = action.payload;
      }
    )
    .addMatcher(
      (action) => [FORGOT_PASSWORD_FAIL,RESET_PASSWORD_FAIL].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
});

const initialAllUsersState = { users: [] };

export const allUsersReducer = createReducer(initialAllUsersState, (builder) => {
  builder
    .addCase(ALL_USERS_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(ALL_USERS_SUCCESS, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase(ALL_USERS_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
    });
});

const initialUserDetailsState = { user: {} };
export const userDetailsReducer = createReducer(initialUserDetailsState, (builder) => {
  builder
    .addCase(USER_DETAILS_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(USER_DETAILS_SUCCESS, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(USER_DETAILS_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
    });
});