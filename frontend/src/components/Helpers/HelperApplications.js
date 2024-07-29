import React, { useEffect, useState } from 'react';
import Sidebar from "../Layout/Sidebar.js";
import { useDispatch, useSelector } from 'react-redux';
import { getUserProblemDetails, clearErrors, loadOtherUser } from '../../actions/userActions';
import Loader from '../Layout/Loader';
import { toast } from 'react-hot-toast';
import './helperApplications.css'; 
import { Link } from 'react-router-dom';

const HelperApplications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { applicationDetails, loading, error } = useSelector((state) => state.applications);

  const [applications, setApplications] = useState([]);

  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  };

  useEffect(() => {
    if (user && user.applications) {
      user.applications.forEach(app => {
        dispatch(getUserProblemDetails(app.userId, app.problemId));
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (applicationDetails && applicationDetails.length) {
      const detailedApplications = applicationDetails.map(detail => {
        const userApplication = user.applications.find(app => app.problemId === detail.problemId);
        return {
          ...detail,
          appliedAt: userApplication ? userApplication.appliedAt : '',
          status: userApplication ? userApplication.status : '',
        };
      });
      setApplications(detailedApplications);
    }
  }, [applicationDetails, user]);

  return (
    <div className='main'>
      <Sidebar />
      {loading ? <Loader /> : (
        <div className="applicationContainer">
          <h2 style={{ padding: "25px" }}>Your Applications</h2>
          {applications.length > 0 ? (
            applications.map((app, index) => (
              <div key={index} className="application-box">
                <img src={app.avatar.url} alt={app.name} className="application-avatar" />
                <div className="application-details">
                  <h3 className='application-name'>
                    <Link to={`/profile/${app.id}`} onClick={() => { dispatch(loadOtherUser(app.id)) }}>
                      {app.name}
                    </Link>
                  </h3>
                  <p>{app.problem}</p>
                  <div className="application-skills">
                    {app.preferredSkills.map((skill, idx) => (
                      <span key={idx} className="application-skill">{skill}</span>
                    ))}
                  </div>
                  <p>Applied at: {formatDate(app.appliedAt)}</p>
                  <p style={{ color: app.status === "rejected" ? "#e67b7b" : "inherit" }}>Status: {app.status==="pending"?"Pending": (app.status==="rejected"?"Rejected":app.status)}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No applications found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HelperApplications;
