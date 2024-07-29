// src/components/AddSkill.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSkill, clearErrors } from '../../actions/userActions';
import '../RegisterLogin/RegisterLogin.css';
import "./addSkill.css"
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../Layout/Loader';
import { ADD_SKILL_RESET } from '../../constants/userConstants';
// import logo from "../../images/logo.png"

export const predefinedSkills = [
    "Plumbing", "Electrical Work", "Carpentry", "Tutoring", "Elderly Care",
    "First Aid/CPR", "Computer Repair", "Gardening", "House Cleaning", "Cooking and Meal Preparation"
];

const AddSkill = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availability, setAvailability] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isSkillAdded } = useSelector((state) => state.profile);

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(selectedSkill => selectedSkill !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    dispatch(addSkill({ skills: selectedSkills, availability }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isSkillAdded) {
      toast.success("Skill added successfully!");
      dispatch({type: ADD_SKILL_RESET});
      navigate("/profile");
    }
  }, [error, isSkillAdded, navigate, dispatch]);

  return (
    loading ? <Loader /> : (
      <div className="registerLoginContainer">
        {/* <div className="frontImg" style={{ height: "62%" }}>
          <img src={logo} alt="Logo" />
        </div> */}
        <div className="registerLoginBox">
          <div className="registerForm">
            <h2>Add Skill</h2>
            <form onSubmit={handleAddSkill}>
              <div className="addSkilladdSkillFormGroup">
                {predefinedSkills.map((skill, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`skillButton ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="addSkillFormGroup">
                <select 
                  id="availability" 
                  name="availability" 
                  onChange={(e) => setAvailability(e.target.value)} 
                  required
                >
                  <option disabled selected value> -- select availability -- </option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Evenings">Evenings</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>
              <div className="addSkillFormGroup">
                <input type="submit" value="Add Skill" />
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddSkill;
