import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  COMPLETE_PROFILE_REQUEST,
  COMPLETE_PROFILE_SUCCESS,
  COMPLETE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  CLEAR_ERRORS,
  CREATE_PROBLEM_REQUEST,
  CREATE_PROBLEM_SUCCESS,
  CREATE_PROBLEM_FAIL,
  DELETE_PROBLEM_SUCCESS,
  DELETE_PROBLEM_FAIL,
  CHANGE_PROBLEM_STATUS_SUCCESS,
  CHANGE_PROBLEM_STATUS_FAIL,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_FAIL,
  ADD_SKILL_REQUEST,
  ADD_SKILL_SUCCESS,
  ADD_SKILL_FAIL,
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
  APPLY_PROBLEM_FAIL ,
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
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,

} from '../constants/userConstants.js';

// Register
export const register = (userData) => async (dispatch) => {
    try {
      dispatch({ type: REGISTER_REQUEST });
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/register`, userData, config);
  
      dispatch({ type: REGISTER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Unknown error occurred'
      });
    }
  };
  

//Login
export const login = (email,password)=>async(dispatch)=>{
    try{
        dispatch({
            type:LOGIN_REQUEST
        });
        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/login`,
        { email, password },
        config
        );

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    }catch(error){
        dispatch({
            type:LOGIN_FAIL,
            payload:  error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Unknown error occurred'
        })
    }
}

//Load User
export const loadUser = ()=>async(dispatch)=>{
  try{
      dispatch({
          type:LOAD_USER_REQUEST
      });
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/me`);

  dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });

  }catch(error){
      dispatch({
          type:LOAD_USER_FAIL
      })
  }
}

//Load Other User
export const loadOtherUser = (id)=>async(dispatch)=>{
  try{
      dispatch({
          type:LOAD_OTHER_USER_REQUEST
      });
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/user/${id}`);

  dispatch({ type: LOAD_OTHER_USER_SUCCESS, payload: data.user });

  }catch(error){
      dispatch({
          type:LOAD_OTHER_USER_FAIL,
          payload:  error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Unknown error occurred'
        })
  }
}

//Logout
export const logout = ()=>async(dispatch)=>{
  try{
      await axios.get(`${BACKEND_URL}/api/v1/logout`);

  dispatch({ type: LOGOUT_SUCCESS});

  }catch(error){
      dispatch({
          type:LOGOUT_FAIL,
          payload:  error.response && error.response.data && error.response.data.error
    ? error.response.data.error
    : 'Unknown error occurred'
      })
  }
}

// Complete Profile
export const completeProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: COMPLETE_PROFILE_REQUEST });
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    
    const {data}=await axios.post(`${BACKEND_URL}/api/v1/profile/complete`, userData, config);

    dispatch({ type: COMPLETE_PROFILE_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: COMPLETE_PROFILE_FAIL,
      payload: error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Unknown error occurred'
    });
  }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    
    const {data}= await axios.put(`${BACKEND_URL}/api/v1/me/update`, userData, config);

    dispatch({ type: UPDATE_PROFILE_SUCCESS ,payload: data.success });
    dispatch(loadUser())
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Unknown error occurred'
    });
  }
};

//Forgot password
export const forgotPassword = (email)=>async(dispatch)=>{
  try{
      dispatch({ type:FORGOT_PASSWORD_REQUEST });
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      const { data } = await axios.post( `${BACKEND_URL}/api/v1/password/forgot`, email,config );

  dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  }catch(error){
      dispatch({
          type:FORGOT_PASSWORD_FAIL,
          payload:  error.response && error.response.data && error.response.data.error
    ? error.response.data.error
    : 'Unknown error occurred'
      })
  }
}

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.put(
      `${BACKEND_URL}/api/v1/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Unknown error occurred'
    });
  }
};

//change password
export const changePassword = (oldPassword,newPassword,confirmPassword)=>async(dispatch)=>{
  try{
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    const config = { headers: { "Content-Type": "multipart/form-data" } };

      const {data}=await axios.put(`${BACKEND_URL}/api/v1/password/update`,{oldPassword,newPassword,confirmPassword},config);

  dispatch({ type: CHANGE_PASSWORD_SUCCESS,payload: data.message});

  }catch(error){
      dispatch({
          type:CHANGE_PASSWORD_FAIL,
          payload:  error.response && error.response.data && error.response.data.error
    ? error.response.data.error
    : 'Unknown error occurred'
      })
  }
}

// Create Problem
export const createProblem = (problem,preferredHelperSkills) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PROBLEM_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    
    const {data}= await axios.put(`${BACKEND_URL}/api/v1/problem`, {problem,preferredHelperSkills}, config);

    dispatch({ type: CREATE_PROBLEM_SUCCESS ,payload: data.success });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: CREATE_PROBLEM_FAIL,
      payload: error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Unknown error occurred'
    });
  }
};

//Delete Problem
export const deleteProblem = (problemId)=>async(dispatch)=>{
  try{
      const {data}=await axios.delete(`${BACKEND_URL}/api/v1/problem?problemId=${problemId}`);

  dispatch({ type: DELETE_PROBLEM_SUCCESS,payload: data.message});

  dispatch(loadUser());
 

  }catch(error){
      dispatch({
          type:DELETE_PROBLEM_FAIL,
          payload:  error.response && error.response.data && error.response.data.error
    ? error.response.data.error
    : 'Unknown error occurred'
      })
  }
}
//change status
export const changeStatus = (problemId)=>async(dispatch)=>{
  try{
      const {data}=await axios.put(`${BACKEND_URL}/api/v1/problem/status?problemId=${problemId}`);

  dispatch({ type: CHANGE_PROBLEM_STATUS_SUCCESS,payload: data.message});

  dispatch(loadUser());

  }catch(error){
      dispatch({
          type:CHANGE_PROBLEM_STATUS_FAIL,
          payload:  error.response && error.response.data && error.response.data.error
    ? error.response.data.error
    : 'Unknown error occurred'
      })
  }
}

// Add skill action - helper
export const addSkill = ({skills,availability}) => async (dispatch) => {
  try {
    dispatch({ type: ADD_SKILL_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const { data } = await axios.put(`${BACKEND_URL}/api/v1/skill`, { skills ,availability}, config);

    dispatch({
      type: ADD_SKILL_SUCCESS,
      payload: data.success
    });
    dispatch(loadUser())
  } catch (error) {
    dispatch({
      type: ADD_SKILL_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

//Getting nearby users
export const getNearbyUsers = (longitude,latitude, skills) => async (dispatch) => {
  try {
    dispatch({ type: NEARBY_USER_REQUEST });

    const config = { headers: { 'Content-Type': 'application/json',  },};
    const { data } = await axios.post(`${BACKEND_URL}/api/v1/nearby`, {longitude,latitude, skills }, config);

    dispatch({
      type: NEARBY_USER_SUCCESS,
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: NEARBY_USER_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};
//Getting nearby users - for seeker problems
export const getNearbyUsersSeekers = (longitude,latitude, skills) => async (dispatch) => {
  try {
    dispatch({ type: NEARBY_USER_REQUEST });
    
    const config = { headers: { 'Content-Type': 'application/json'  }};

    const { data } = await axios.post(`${BACKEND_URL}/api/v1/nearbySeekers`, {longitude,latitude, skills }, config);

    dispatch({
      type: NEARBY_USER_SUCCESS,
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: NEARBY_USER_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Create Review
export const createReview = (rating,comment,helperId) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_REVIEW_REQUEST });

    const config = {headers: {'Content-Type': 'application/json',},};

    const { data } = await axios.put(`${BACKEND_URL}/api/v1/review`, {rating,comment,helperId}, config);

    dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data.success, });
  } catch (error) {
    dispatch({
      type: CREATE_REVIEW_FAIL,
      payload: error.response && error.response.data.message 
      ? error.response.data.message 
      : error.message,
    });
  }
};

// Apply for a problem action
export const applyForProblem = (curUserID, userId, problemId) => async (dispatch) => {
  try {
    dispatch({ type: APPLY_PROBLEM_REQUEST });

    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post(`${BACKEND_URL}/api/v1/problem/apply`, { curUserID, userId, problemId }, config);

    dispatch({
      type: APPLY_PROBLEM_SUCCESS,
      payload: data.success,
    });
    dispatch(loadUser());

  } catch (error) {
    dispatch({
      type: APPLY_PROBLEM_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Action to fetch user problem details
export const getUserProblemDetails = (userId, problemId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_PROBLEM_DETAILS_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };

    const { data } = await axios.post(`${BACKEND_URL}/api/v1/application`,{userId, problemId},config);

    if (data.application) {
      dispatch({
        type: GET_USER_PROBLEM_DETAILS_SUCCESS,
        payload: data.application,
      });
    } else {
      dispatch({
        type: GET_USER_PROBLEM_DETAILS_SUCCESS,
        payload: null,
      });
    }
  } catch (error) {
    dispatch({
      type: GET_USER_PROBLEM_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Add notification - to seeker
export const addNotification = (seekerId, problemId,type) => async (dispatch) => {
  try {
    dispatch({ type: ADD_NOTIFICATION_REQUEST });

    const config = {headers: { 'Content-Type': 'application/json',}};
    const { data } = await axios.post(`${BACKEND_URL}/api/v1/notification`, { seekerId, problemId,type }, config);
    dispatch({
      type: ADD_NOTIFICATION_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: ADD_NOTIFICATION_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Add notification - to helper
export const addNotificationHelper = (helperId, problemId,type) => async (dispatch) => {
  try {
    dispatch({ type: ADD_NOTIFICATION_REQUEST });

    const config = {headers: { 'Content-Type': 'application/json',}};
    const { data } = await axios.post(`${BACKEND_URL}/api/v1/notification-helper`, { helperId, problemId ,type}, config);
    dispatch({
      type: ADD_NOTIFICATION_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: ADD_NOTIFICATION_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

//fetching notifications
export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });

    const { data } = await axios.get(`${BACKEND_URL}/api/v1/notifications`);

    dispatch({
      type: FETCH_NOTIFICATIONS_SUCCESS,
      payload: data.notifications,
    });
  } catch (error) {
    dispatch({
      type: FETCH_NOTIFICATIONS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Action to delete notification and handle rejection
export const rejectNotification = (notificationId) => async (dispatch) => {
  try {
    dispatch({ type: REJECT_NOTIFICATION_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };

    await axios.post(`${BACKEND_URL}/api/v1/notifications/delete`, { notificationId }, config);

    dispatch({ type: REJECT_NOTIFICATION_SUCCESS });
    dispatch(fetchNotifications())
  } catch (error) {
    dispatch({
      type: REJECT_NOTIFICATION_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Clearing errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// get All Users - admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const { data } = await axios.get(`${BACKEND_URL}/api/v1/admin/users`);

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
  }
};

// get  User Details
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axios.get(`${BACKEND_URL}/api/v1/admin/user/${id}`);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
  }
};

// Delete User -- admin
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`${BACKEND_URL}/api/v1/admin/user/${id}`);

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update User
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `${BACKEND_URL}/api/v1/admin/user/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};