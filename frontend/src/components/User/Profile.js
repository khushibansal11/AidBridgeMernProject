import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Layout/Sidebar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Layout/Loader";
import ProblemCard from "../Problems/ProblemCard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PhoneIcon from "@mui/icons-material/Phone";
import ReviewCard from "../Reviews/ReviewCard";
import { useParams } from 'react-router-dom';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Rating from '@mui/material/Rating';
import DialogTitle from '@mui/material/DialogTitle';
import { clearErrors, createReview, loadOtherUser } from "../../actions/userActions";
import toast from "react-hot-toast";
import { createChat } from "../../actions/chatActions";
import { CLEAR_ERRORS } from "../../constants/chatConstants";

const Profile = () => {
  
  const { id } = useParams();
  const dispatch=useDispatch();
  const navigate = useNavigate();
  
  const { error,loading, user,user2 } = useSelector((state) => state.user);
  const {chat} = useSelector(state => state.chat)
  const {error:reviewError,loading:reviewLoading, success } = useSelector((state) => state.reviews);
  const [showSkill, setShowSkill] = useState(false)
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  
  const showAction = id ? false : true;
  const displayUser = id ? user2 : user;

  
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const reviewSubmitHandler = () => {
    const helperId=displayUser._id;
    dispatch(createReview(rating,comment,helperId));
    setOpen(false);
  };

  useEffect(() => {
    if(id){
      dispatch({type: CLEAR_ERRORS})
      dispatch(loadOtherUser(id));
    }
    if(!id){
      dispatch({type: CLEAR_ERRORS})
    }
  }, [id,dispatch])
  

  useEffect(() => {
    if (error || reviewError) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if(success){
      dispatch(loadOtherUser(id));
      dispatch(clearErrors());
    }
    if(chat){
      navigate(`/chat/${chat._id}`)
    }  
  }, [error,reviewError, dispatch,success,id,chat,navigate]); 

  if(!displayUser.avatar){
    return <Loader/>
  }

  const options = {
    size: "medium",
    value: displayUser.role==="Helper"? displayUser.ratings : 0,
    readOnly: true,
    precision: 0.5,
  };
  const handleChat = (participantId) => {
    dispatch(createChat(participantId)) 
  };

  return (
    loading || reviewLoading ?(
    <Loader />
  ) : (
    <div className="main">
      <Sidebar />
      <div className="profile">
        <div className="profileContainer">
          <div className="profileDetailBox">
            <div className="avatar">
              <div>
                <img src={displayUser.avatar.url} alt="ProfileImg" />
              </div>
            </div>
            <div className="details">
              <div className="name profileData">
                {displayUser.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {displayUser.role === "Helper" && <span><Rating {...options} /></span>}
                {displayUser.role === "Helper" && <span className="numReviews">({displayUser.numOfReviews} Reviews)</span>}
              </div>
              
              <div className="role">{displayUser.role}</div>
              <div className="location profileData">
                <LocationOnIcon className="icon" />{" "}
                <div className="locationName">
                  {displayUser.location.city} , {displayUser.location.state} ,{" "}
                  {displayUser.location.country}
                </div>
              </div>
              {displayUser.role === "Helper" && (
                <>
                  <div className="bio profileData">
                    <AutoStoriesIcon className="icon" />{" "}
                    {displayUser.bio !== "" ? displayUser.bio : "Available for work"}
                  </div>
                  <div className="phoneNo profileData">
                    <PhoneIcon className="icon" />{" "}
                    {displayUser.phoneNo !== "" ? displayUser.phoneNo : "Available for work"}
                  </div>
                </>
              )}
            </div>
          </div>
          { showAction && <div className="updateButtons">
            <div className="updateProfileBtn">
              <Link to="/me/update" className="link">
                Update Profile
              </Link>
            </div>
            <div className="changePasswordBtn">
              <Link className="link" to="/password/change">
                Change Password
              </Link>
            </div>
            {displayUser.role === "Helper" && <div className="addSkillBtn">
            <Link className="link" to="/addSkill">
                {displayUser.skills.length===0? "Add Skill":"Update Skill"}
              </Link>
            </div>}
          </div> 
          }
          {user2._id && <div className="updateButtons">
            <div className="messageBtn">
              <Link onClick={()=>{handleChat(user2._id)}} className="link">
                Message
              </Link>
            </div>
            </div>}
          <div className="sectionHeading">
            {displayUser.role !== "Helper" ? <div>Problems</div> : <div style={{display: "flex",gap:"2vmax"}}><div onClick={()=>setShowSkill(false)} style={showSkill? {color:"gray",cursor:"pointer"}:{color:"black"}}>Reviews</div><div onClick={()=>setShowSkill(true)} style={showSkill? {color:"black"}:{color:"gray",cursor:"pointer"}}>Skills</div></div>}
          </div>
          <hr style={{ marginTop: "5px" }} />
          {displayUser.role === "Seeker" ? (
            displayUser.problems.length > 0 ? (
              <div className="problemsList">
                {displayUser.problems.map(
                  (item, index) =>
                    item.status === "pending" && (
                      <ProblemCard
                        key={index}
                        showIcon={false}
                        problem={item.problem}
                        preferredHelperSkills={item.preferredHelperSkills}
                        createdAt={item.createdAt}
                        status={item.status}
                      />
                    )
                )}
              </div>
            ) : (
              <div style={{ padding: "4vmax", paddingLeft: "14vmax" }}>Add Your Problems</div>
            )
          ) : !showSkill ? <>{(displayUser.reviews.length > 0 ? (
            <div className="reviewList">
              {displayUser.reviews.map((item, index) => (
                <ReviewCard
                  key={index}
                  avatar={item.avatar}
                  name={item.name}
                  rating={item.rating}
                  comment={item.comment}
                  userId={item.user}
                />
              )
            )}
            </div>
          ) : (
            user.role==="Helper" &&<div style={{ padding: "4vmax", paddingLeft: "14vmax" }}>
              No reviews yet
            </div>
          )
        )}
        {user.role==="Seeker" && <div className="reviewCard" onClick={()=>{submitReviewToggle()}} style={{justifyContent:"center",cursor:"pointer"}}><ControlPointOutlinedIcon/>Add a Review</div>
        }
        {displayUser.role==="Helper" &&  <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <button onClick={submitReviewToggle} color="secondary">
                Cancel
              </button>
              <button onClick={reviewSubmitHandler} color="primary">
                Submit
              </button>
            </DialogActions>
          </Dialog>
}
         </>: 
          <div className="profileSkillsList">
              {displayUser.skills.length > 0 ? <> 
                {displayUser.skills.map((skill, index) => (
                  <div key={index} className="profileSkillItem">
                    <span className="skillName">{skill}</span>
                  </div>
                ))}
                <span className="profileSkillItem availability">Availibility : {user.availability}</span>
                
              </>: (
                <div>No skills added yet</div>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  )
  )};

export default Profile;
