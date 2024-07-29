import React from 'react';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './seekerProblemCard.css'; // Ensure this file exists and styles are defined
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, applyForProblem, loadOtherUser } from '../../actions/userActions';
// import toast from 'react-hot-toast';

const SeekerProblemCard = ({ user, problem }) => {
  const dispatch = useDispatch();
  const { user: curUser } = useSelector((state) => state.user);

  const handleNameClick = (id) => {
    dispatch(loadOtherUser(id));
  };

  const handleApply = (curUserID, userId, problemId) => {
    dispatch(applyForProblem(curUserID, userId, problemId));
    let seekerId = userId;
    let type="apply";
    dispatch(addNotification(seekerId,problemId,type));
  };

  return (
    <div className='seekerProblemCard'>
      <img src={user.avatar.url} alt="User Avatar" className='searchProblemImg' />
      <div className='problemDetails'>
        <Link to={`/profile/${user._id}`} onClick={() => handleNameClick(user._id)} className='seekerName'>
          {user.name}
        </Link>
        <div className='location'>
          <LocationOnIcon className='locationIcon' />
          {user.location.city}, {user.location.state}, {user.location.country}
        </div>
        <div className='problemDescription'>
          <strong>Problem: {problem.problem}</strong>
        </div>
        <div className='preferredSkillsBox'>
          <strong>Preferred Skills:</strong>
          <div className='preferredSkills'>
            {problem.preferredHelperSkills.map((skill, index) => (
              <span key={index} className='skillItem'>{skill}</span>
            ))}
          </div>
        </div>
        <div className="applyBtnContainer">
          <button className='applyButton' onClick={() => handleApply(curUser._id, user._id, problem._id)}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default SeekerProblemCard;
