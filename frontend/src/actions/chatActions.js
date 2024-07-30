import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
import {
    CREATE_CHAT_SUCCESS,
    CREATE_CHAT_FAIL,
    GET_CHAT_LIST_REQUEST, GET_CHAT_LIST_SUCCESS, GET_CHAT_LIST_FAIL,
    // SEND_MESSAGE_REQUEST,
    // SEND_MESSAGE_SUCCESS,
    // SEND_MESSAGE_FAIL,
    GET_CHAT_HISTORY_REQUEST,
    GET_CHAT_HISTORY_SUCCESS,
    GET_CHAT_HISTORY_FAIL,
    LOAD_MORE_MESSAGES_REQUEST,
  LOAD_MORE_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_FAIL,
    CLEAR_ERRORS
} from '../constants/chatConstants';

export const createChat = (participantId) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${BACKEND_URL}/api/v1/chat`, { participantId });
        dispatch({
            type: CREATE_CHAT_SUCCESS,
            payload: data.chat,
        });
    } catch (error) {
        dispatch({
            type: CREATE_CHAT_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const getChatList = () => async (dispatch) => {
    try {
        dispatch({ type: GET_CHAT_LIST_REQUEST });

        const { data } = await axios.get(`${BACKEND_URL}/api/v1/chat-list`);

        dispatch({
            type: GET_CHAT_LIST_SUCCESS,
            payload: data.chatList,
        });
    } catch (error) {
        dispatch({
            type: GET_CHAT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Send message
// export const sendMessage = (chatId, text) => async (dispatch) => {
//     try {
//         dispatch({ type: SEND_MESSAGE_REQUEST });

//         const { data } = await axios.post(`${BACKEND_URL}/api/v1/send-message`, { chatId, text });

//         dispatch({
//             type: SEND_MESSAGE_SUCCESS,
//             payload: data.message
//         });
//     } catch (error) {
//         dispatch({
//             type: SEND_MESSAGE_FAIL,
//             payload: error.response && error.response.data.message ? error.response.data.message : error.message,
//         });
//     }
// };

export const getChatHistory = (chatId) => async (dispatch) => {
    try {
      dispatch({ type: GET_CHAT_HISTORY_REQUEST });
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/chats/${chatId}/messages`);
      dispatch({ type: GET_CHAT_HISTORY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_CHAT_HISTORY_FAIL, payload:  error.response && error.response.data.message ? error.response.data.message : error.message, });
    }
  };
  
  export const loadMoreMessages = (chatId, lastMessageId) => async (dispatch) => {
    try {
      dispatch({ type: LOAD_MORE_MESSAGES_REQUEST });
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/chats/${chatId}/messages`, {
        params: { lastMessageId },
      });
      dispatch({ type: LOAD_MORE_MESSAGES_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: LOAD_MORE_MESSAGES_FAIL, payload:  error.response && error.response.data.message ? error.response.data.message : error.message, });
    }
  };

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
