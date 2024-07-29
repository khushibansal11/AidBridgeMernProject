import React from 'react';
import './reviewCard.css';
import { Link } from "react-router-dom";
import avatarImg from "../../images/Profile.png";
import Rating from '@mui/material/Rating';

const ReviewCard = ({ avatar = avatarImg, name, rating, comment, userId }) => {

  const options = {
    size: "medium",
    value: rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className='reviewCard'>
      <div className="reviewAvatar">
        <img src={avatar} alt="" />
      </div>
      <div className="reviewContent">
        <Link to={`/profile/${userId}`} className="reviewName">{name}</Link>
        <div className="reviewrAting"><Rating {...options} /></div>
        <div className="reviewComment">{comment}</div>
      </div>
    </div>
  );
}

export default ReviewCard;
