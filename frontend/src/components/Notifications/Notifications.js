import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Layout/Sidebar';
import { fetchNotifications, clearErrors, rejectNotification } from '../../actions/userActions';
import Loader from '../Layout/Loader';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import './notifications.css';
import {  useNavigate } from 'react-router-dom';
import { createChat } from '../../actions/chatActions';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, notifications, error } = useSelector(state => state.notifications);
  const {chat} = useSelector(state => state.chat)

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if(chat){
      navigate(`/chat/${chat._id}`)
    }   
  }, [error, dispatch,chat,navigate]);

  const handleChat = (participantId) => {
    // Implement chat functionality
    dispatch(createChat(participantId)) 
  };

  const handleDecline = (notificationId) => {
    dispatch(rejectNotification(notificationId));
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="notificationsContent">
        <h2 style={{margin: "0px 0px 43px 10px"}}>Your Notifications</h2>
        {loading ? (
          <Loader />
        ) : notifications.length > 0 ? (
          notifications.slice().reverse().map((notification, index) => (
            <div key={index} className="notification-box">
              <p >
              {notification.helperName && `${notification.helperName} wants to solve "${notification.problem}"`}
                {notification.seekerName && notification.type === "reject" && `${notification.seekerName} rejected your application for "${notification.problem}"`}
                {notification.seekerName && notification.type === "request" && `${notification.seekerName} wants you to solve "${notification.problem}"`}
                {notification.message && `${notification.message}`}
                
                <span className="notification-time">
                  {moment(notification.createdAt).fromNow()}
                </span>
              </p>
              {notification.helperName  && <div className="notification-actions">
                <button onClick={() => handleChat(notification.helperId || notification.seekerId)} className="btn-chat">Chat</button>
                <button onClick={() => handleDecline(notification._id)} className="btn-decline">Decline</button>
              </div>}
              {notification.type === "request" && 
              <button onClick={() => handleChat(notification.helperId || notification.seekerId)} className="btn-chat">Chat</button>}
            </div>
          ))
        ) : (
          <p>No notifications found</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
