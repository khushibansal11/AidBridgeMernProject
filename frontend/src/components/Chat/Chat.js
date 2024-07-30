import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getChatList, clearErrors, getChatHistory, loadMoreMessages } from '../../actions/chatActions';
import './Chat.css';
import Sidebar from "../Layout/Sidebar";
import { Link, useParams } from 'react-router-dom';

const socket = io(`${window.location.protocol}//${window.location.hostname}`, {
  withCredentials: true
});

const Chat = () => {
  const {id}=useParams();
  const dispatch = useDispatch();
  const { loading, error, messages: chatMessages, chatList, hasMore } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.user);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  const handleSelectChat = (chatId) => {
    const chat = chatList.find(chat => chat.chatId === chatId);
    if (chat) {
      setSelectedChat(chatId);
      setSelectedAvatar(chat.participants[0].avatar.url);
      setSelectedName(chat.participants[0].name);
      setSelectedId(chat.participants[0]._id);
      dispatch(getChatHistory(chatId));
    }
  };

  const handleSendMessage = () => {
    if (text.trim() && selectedChat) {
      const message = { chatId: selectedChat, text, sender: user._id };
      socket.emit('sendMessage', message);
      setText('');
    }
  };

  useEffect(() => {
    if (selectedChat) {
      dispatch(getChatHistory(selectedChat));
      socket.emit('joinChat', selectedChat);

      socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    dispatch(getChatList());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
      dispatch(clearErrors());
    }
    if(id){
      handleSelectChat(id);
    }
  }, [dispatch, error,id]);

  useEffect(() => {
    setMessages(chatMessages);
  }, [chatMessages]);

  const fetchMoreMessages = () => {
    if (selectedChat && !loading && hasMore) {
      const lastMessageId = messages[0]?._id; // Get the ID of the first message in the current list
      dispatch(loadMoreMessages(selectedChat, lastMessageId));
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 200);  };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    };
  
  return (
    <div className='main'>
      <Sidebar />
      <div className='chat-container'>
        <div className='chat-list'>

          <h2 style={{ padding: "21px",marginBottom: "23px" }}>Chats</h2>
          {
            chatList.map((chat) => (
              <div
                key={chat.chatId}
                className={`chat-list-item ${selectedChat === chat.chatId ? 'selected' : ''}`}
                onClick={() => handleSelectChat(chat.chatId)}
              >
                <img src={chat.participants[0].avatar.url} alt={chat.participants[0].name} className='chat-avatar' />
                <div className='chat-info'>
                  <span className='chat-name'>{chat.participants[0].name}</span>
                </div>
              </div>
            ))
          }
        </div>
        <div className='chat-window'>
          {selectedChat ? (
            <>
              <div className="chat-user-info">
              <img src={selectedAvatar} alt={selectedName} className='chat-avatar' />
              <Link to={`/profile/${selectedId}`}><span>{selectedName}</span></Link>
              </div>
              <div className='messages' id="scrollableDiv" ref={scrollRef}>
                <InfiniteScroll
                  dataLength={messages.length}
                  next={fetchMoreMessages}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  inverse={true}
                  scrollableTarget="scrollableDiv"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message ${msg.sender._id === user._id ? 'sender' : 'receiver'}`}
                    >
                      <div className='message-text'>{msg.text}</div>
                       <div className={`timestamp ${msg.sender._id === user._id ? 'sender' : 'receiver'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </InfiniteScroll>
              </div>
              <div className='input-container'>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Type a message'
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage} disabled={loading}>Send</button>
              </div>
            </>
          ) : (
            <div className='no-chat-selected'>
              <span>Send and receive messages here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
