import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Layout/Sidebar';
import Loader from '../Layout/Loader';
import { toast } from 'react-hot-toast';
import { clearErrors } from "../../actions/userActions";
import HelperSearchCard from './HelperSearchCard'; // Import the HelperSearchCard component
import './searchHelpers.css'; // Create this CSS file for styling
import { useParams } from 'react-router-dom';

const SearchHelpers = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const { loading, error, users } = useSelector((state) => state.nearbyUsers);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    loading ? <Loader /> : (
      <div className='main'>
        <Sidebar />
        <div style={{alignItems: users.length > 0?"":"center"}} className='searchHelpersContent'>
          {users.length > 0 ? (
            <>
            <div style={{marginBottom: "30px"}}>Following helpers match your skills..</div>
            {users.map(user => (
              <HelperSearchCard key={user._id} user={user} problemId={id}/>
            ))}
            </>
          ) : (
            <div style={{paddingTop: "256px"}}>No nearby users found.</div>
          )}
        </div>
      </div>
    )
  );
};

export default SearchHelpers;
