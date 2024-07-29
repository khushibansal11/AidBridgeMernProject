import React, { useState,useEffect } from 'react';
import './postProblem.css';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Layout/Sidebar';
import CreateIcon from '@mui/icons-material/Create';
import Loader from '../Layout/Loader';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { toast } from 'react-hot-toast';
import {createProblem,clearErrors} from "../../actions/userActions"
import { CREATE_PROBLEM_RESET } from '../../constants/userConstants';

const predefinedSkills = [
  "Plumbing", "Electrical Work", "Carpentry", "Tutoring", "Elderly Care",
  "First Aid/CPR", "Computer Repair", "Gardening", "House Cleaning", "Cooking and Meal Preparation"
];

const PostProblem = () => {
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [problemText, setProblemText] = useState("");

  const dispatch = useDispatch();
  const {loading,error,isCreated} = useSelector((state)=>state.problems)

  const handleSkillClick = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = () => {
    if (!problemText || selectedSkills.length === 0) {
      toast.error("Please provide a problem description and select at least one skill.");
      return;
    }
    
    dispatch(createProblem(problemText,selectedSkills));
    
  };

  useEffect(() => {
    if(error){
        toast.error(error);
        dispatch(clearErrors());
    }
    if(isCreated){
        toast.success("Problem Created Successfully!")
      setProblemText("");
      setSelectedSkills([]);
      dispatch({type: CREATE_PROBLEM_RESET})
    }
  }, [error,dispatch,isCreated])
  

  return (
    loading ? <Loader /> : (
      <div className='main'>
        <Sidebar />
        <div className="postProblemContainer">
          <h2>Post Your Problem Here</h2>
          <hr style={{ width: "88%" }} />
          <div className="postBox">
            <div className="problem">
              <CreateIcon className='icon' style={{ width: "21px", marginTop: "-2px" }} />
              <textarea
                type="text"
                placeholder='Write your problem'
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
              />
            </div>
            <div className="helperSkill">
              <TipsAndUpdatesIcon className='icon' style={{ width: "21px", marginTop: "-2px" }}/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Add preferred helper skills: 
              <div className="skillsList ">
                {predefinedSkills.map((skill) => (
                  <div
                    key={skill}
                    className={`skillItem ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => handleSkillClick(skill)}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="submitButton" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    )
  );
}

export default PostProblem;
