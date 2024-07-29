import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from './AdminLayout/sidebar';
import "../RegisterLogin/RegisterLogin.css"
import "./SendNotification.css"

const SendNotification = () => {
    const [message, setMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [userIds, setUserIds] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/v1/admin/notifications', {
                message,
                userIds: notificationType !== 'allHelpers' && notificationType !== 'allSeekers' && notificationType !== 'allUsers' ? userIds.split(',').map(id => id.trim()) : [],
                type: notificationType,
            });
            toast.success(response.data.message);
            setMessage('');
            setNotificationType('');
            setUserIds('');
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    return (
        <div className="main">
            <Sidebar />
            <div className='sendNotificationContainer registerLoginContainer'>
                <form onSubmit={handleSubmit} className='sendNotificationBox registerLoginBox'>
                    <h2>Send Notification</h2>
                    <div className="formGroup">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder='Message'
                            required
                            className='textarea'
                        />
                    </div>
                    <div className="formGroup">
                        <select
                            value={notificationType}
                            onChange={(e) => setNotificationType(e.target.value)}
                            className='select'
                        >
                            <option disabled value="" > -- Select Notification Type --</option>
                            <option value="allHelpers">All Helpers</option>
                            <option value="allSeekers">All Seekers</option>
                            <option value="allUsers">All Users</option>
                            <option value="specificUsers">Specific Users</option>
                        </select>
                    </div>
                    {notificationType === 'specificUsers' && (
                        <div className="formGroup">
                            <input
                                type="text"
                                value={userIds}
                                onChange={(e) => setUserIds(e.target.value)}
                                placeholder='User IDs (comma separated)'
                                className='input'
                            />
                        </div>
                    )}
                    <div className="sendNotificationformGroup">
                        <button type="submit" className="submitBtn">Send Notification</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendNotification;
