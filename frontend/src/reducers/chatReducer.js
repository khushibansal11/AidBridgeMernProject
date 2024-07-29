import { createReducer } from '@reduxjs/toolkit';
import {
    CREATE_CHAT_SUCCESS,
    CREATE_CHAT_FAIL,
    GET_CHAT_LIST_REQUEST, GET_CHAT_LIST_SUCCESS, GET_CHAT_LIST_FAIL,
//     SEND_MESSAGE_REQUEST,
//   SEND_MESSAGE_SUCCESS,
//   SEND_MESSAGE_FAIL,
  GET_CHAT_HISTORY_REQUEST,
  GET_CHAT_HISTORY_SUCCESS,
  GET_CHAT_HISTORY_FAIL,
  LOAD_MORE_MESSAGES_REQUEST,
  LOAD_MORE_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_FAIL,
    CLEAR_ERRORS,
    CLEAR_CHAT
} from '../constants/chatConstants';

const initialChatState = { chat: null, error: null,chatList: [], messages:[]};

export const chatReducer = createReducer(initialChatState, (builder) => {
    builder
    .addCase(CLEAR_CHAT, (state) => {
        state.chat =null;
      })
        .addCase(CLEAR_ERRORS, (state) => {
            state.error = null;
            state.chat = null;
        })
        .addCase(CREATE_CHAT_SUCCESS, (state, action) => {
            state.loading = false;
            state.chat = action.payload;
        })
        .addCase(GET_CHAT_LIST_SUCCESS, (state, action) => {
            state.loading = false;
            state.chatList = action.payload;
        })
        // .addCase(SEND_MESSAGE_SUCCESS, (state, action) => {
        //     state.loading = false;
        //     state.messages = [...state.messages, action.payload];
        //   })
        .addCase(GET_CHAT_HISTORY_SUCCESS, (state, action) => {
            state.loading = false;
            state.messages= action.payload.messages;
            state.hasMore= action.payload.hasMore;
          })
        .addCase(LOAD_MORE_MESSAGES_SUCCESS, (state, action) => {
            state.loading = false;
            state.messages= [...action.payload.messages, ...state.messages];
            state.hasMore= action.payload.hasMore;
          })
        .addMatcher((action) => [GET_CHAT_LIST_REQUEST,GET_CHAT_HISTORY_REQUEST,LOAD_MORE_MESSAGES_REQUEST].includes(action.type),
            (state) => {
                state.loading = true;
            }
        )
        .addMatcher((action) => [CREATE_CHAT_FAIL, GET_CHAT_LIST_FAIL,GET_CHAT_HISTORY_FAIL,LOAD_MORE_MESSAGES_FAIL].includes(action.type),
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        )
});
