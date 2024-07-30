import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelperSearchCard.css';
import Rating from '@mui/material/Rating';
import { useDispatch } from 'react-redux';
import { addNotificationHelper } from '../../actions/userActions';

const HelperSearchCard = ({ user, problemId }) => {
  const dispatch = useDispatch();

  const options = {
    size: "medium",
    value: user.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [isRequested, setIsRequested] = useState(false);

  const handleRequestClick = (helperId, problemId) => {
    dispatch(addNotificationHelper(helperId, problemId, "request"));
    setIsRequested(true);
  };


  return (
    <div className='helperSearchCard'>
      <div className='helperSearchCardContent'>
        <img src={user.avatar.url} alt={user.name} className='helperSearchCardAvatar' />
        <div className='helperSearchCardDetails'>
          <Link to={`/profile/${user._id}`} className='helperSearchCardName'>
            {user.name}
          </Link>
          <div className='helperSearchCardRating'>
            <Rating {...options} />
          </div>
          <div className='helperSearchCardLocation'>
            {user.location.city}, {user.location.state}, {user.location.country}
          </div>
          <div className='helperSearchCardSkills'>
            {user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <button key={index} className='helperSearchCardSkillButton'>
                  {skill}
                </button>
              ))
            ) : (
              <div>No skills listed</div>
            )}
          </div>
          <div className="requestButton">
            <button
              className='requestBtn'
              onClick={() => handleRequestClick(user._id, problemId)}
              disabled={isRequested}
            >
              {isRequested ? 'Requested' : 'Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperSearchCard;
