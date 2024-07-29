import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Layout/Sidebar';
import Loader from '../Layout/Loader';
import { toast } from 'react-hot-toast';
import { clearErrors, getNearbyUsersSeekers } from "../../actions/userActions";
import SeekerProblemCard from './SeekerProblemCard';
import './searchProblems.css'; 
import store from '../../store';

const SearchProblems = () => {
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.nearbyUsers);
  const { user: curUser } = useSelector((state) => state.user);   

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    store.dispatch(getNearbyUsersSeekers(curUser.location.longitude,curUser.location.latitude,curUser.skills))
  }, [curUser.location.longitude,curUser.location.latitude,curUser.skills]);

  const hasAlreadyApplied = (problemId) => {
    return curUser.applications.some(application => application.problemId === problemId);
  };

  return (
    loading ? <Loader /> : (
      <div className='main'>
        <Sidebar />
        <div style={{alignItems: users.length > 0?"":"center"}} className='searchProblemsContent'>
          {users.length > 0 ? (
            <>
            <div style={{width:"96%"}}><div style={{marginBottom: "30px"}}>Following problems match your skills..</div></div>
            {
            users.map(user => (
              user.matchingProblems
              .filter(problem => !hasAlreadyApplied(problem._id))
              .map((problem, index) => (
                <SeekerProblemCard key={index} user={user} problem={problem} />
              ))
            ))}
            </>
          ) : (
            <div style={{paddingTop: "256px"}}>No nearby problems with matching skills.</div>
          )}
        </div>
      </div>
    )
  );
};

export default SearchProblems;
