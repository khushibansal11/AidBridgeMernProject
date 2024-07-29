import React, { useEffect, useState } from 'react';
import './problemDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Layout/Sidebar';
import Loader from '../Layout/Loader';
import { toast } from 'react-hot-toast';
import { clearErrors } from "../../actions/userActions";
import ProblemCard from './ProblemCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const ProblemDashboard = () => {
  const [activeProblems, setActiveProblems] = useState([]);
  const [resolvedProblems, setResolvedProblems] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    // Filter problems based on status
    const active = user.problems.filter(item => item.status !== "resolved");
    const resolved = user.problems.filter(item => item.status === "resolved");

    setActiveProblems(active);
    setResolvedProblems(resolved);
    setTotalProblems(user.problems.length);
  }, [user.problems]);

  return (
    loading ? <Loader /> : (
      <div className='main'>
        <Sidebar />
        <div className="problemDashboardContainer">
          <h2>Problems Dashboard</h2>
          {/* <hr style={{ width: "88%", marginLeft: "2vmax" }} /> */}

          {/* Circle indicators */}
          <div className="circleIndicators">
            <div className="circle">
              <div className="circleContent">{activeProblems.length}</div>
              <div className="circleLabel">Active</div>
            </div>
            <div className="circle">
              <div className="circleContent">{resolvedProblems.length}</div>
              <div className="circleLabel">Resolved</div>
            </div>
            <div className="circle">
              <div className="circleContent">{totalProblems}</div>
              <div className="circleLabel">Total</div>
            </div>
          </div>

          {/* Active Problems */}
          {activeProblems.length>0 &&
          <div className="activeProblems">
          <h4 style={{alignSelf:"flex-start",margin:"2px 0px 10px 30px",fontFamily:"roboto"}}><AssignmentIcon className='dashboardIcon' />Active Problems</h4>
            {activeProblems.map((item, index) => (
              <ProblemCard
                key={index}
                showIcon={true}
                problem={item.problem}
                preferredHelperSkills={item.preferredHelperSkills}
                createdAt={item.createdAt}
                status={item.status}
                id={item._id}
              />
            ))}
          </div>}

          {/* Resolved Problems */}
          {resolvedProblems.length>0 &&
          <div className="resolvedProblems">
          <h4 style={{alignSelf:"flex-start",margin:"2px 0px 10px 30px",fontFamily:"roboto"}}><TaskAltIcon className='dashboardIcon' />Resolved Problems</h4>
            {  resolvedProblems.map((item, index) => (
              <ProblemCard
                key={index}
                showIcon={true}
                problem={item.problem}
                preferredHelperSkills={item.preferredHelperSkills}
                createdAt={item.createdAt}
                status={item.status}
                id={item._id}
              />
            ))}
          </div>}
          
        </div>
      </div>
    )
  );
}

export default ProblemDashboard;
