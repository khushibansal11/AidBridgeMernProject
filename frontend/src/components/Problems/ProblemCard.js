import React, { useEffect } from 'react';
import "./problemCard.css";
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import {changeStatus, clearErrors, deleteProblem,getNearbyUsers} from "../../actions/userActions"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProblemCard = ({ showIcon, problem, preferredHelperSkills, createdAt, status,id}) => {

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const {error} = useSelector((state)=>state.problems)
  const {user} = useSelector((state)=>state.user)

  const dispatch = useDispatch();
  const navigate=useNavigate();

  const HandelDeleteProblem=(id)=>{
    dispatch(deleteProblem(id));
  }
  const onStatusChange=(id)=>{
    dispatch(changeStatus(id));
  }
  const handleSearchHelperBtn=(id)=>{
    dispatch(getNearbyUsers(user.location.longitude,user.location.latitude,preferredHelperSkills));
    navigate(`/search-helpers/${id}`)
  }
  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(clearErrors);
    }
    // if(message){
    //   toast.success(message);
    // }
  }, [error,dispatch])  

  return (
    <div className='problemCard'>
      {showIcon && (
        <div className="cardHeader">
        <div className="actions">
          {/* <span><EditIcon className='actionIcon'/></span> */}
          <span onClick={() => HandelDeleteProblem(id)}><DeleteIcon className='actionIcon' /></span>
        </div>
      <hr />
      </div>
    )}
      <div className="problemContainer">
      <div className="problem">
        <h3>{problem}</h3>
      </div>
      <div className="preferredSkills">
        <div className="skillsContainer">
          {preferredHelperSkills.map((skill, index) => (
            <div className="skill" key={index}>{skill}</div>
          ))}
        </div>
      </div>
      <div className="createdAt">
        <h5>Created At:</h5>
        <p>{formatDate(createdAt)}</p>
      </div>
      <div className="status">
        <h5>Status:</h5>
        <p>{status==="pending"?"Pending":"Resolved"}</p>
      </div>
      {showIcon && status !== "resolved" && <div className="problemAction">
          <button className="statusButton" onClick={() => onStatusChange(id)}>
            Mark as Resolved
          </button>
          <button className="searchButton" onClick={()=>{handleSearchHelperBtn(id)}}>
            Search for Helpers
          </button>
      </div>
      }
      </div>
    </div>
  );
}

export default ProblemCard;
