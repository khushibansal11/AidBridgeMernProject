import React, { useEffect } from 'react';
import './Sidebar.css';
import logo from "../../../images/logo.jpg";
import { useDispatch, useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from "react-router-dom";
import { logout, clearErrors } from "../../../actions/userActions";
import { toast } from 'react-hot-toast';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Sidebar = () => {
  const { error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged Out Successfully");
  };
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" />
      <div className='listItems'>
        
        
          <Link to="/admin/dashboard">
            <div className='listItem'>
              <DashboardIcon className="item-icon"/>
              <span className="item-name">Dashboard</span>
            </div>
          </Link>
          
        
          <Link to="/admin/users">
            <div className='listItem'>
              <PeopleAltIcon className="item-icon"/>
              <span className="item-name">Users</span>
            </div>
          </Link>

        <Link to="/admin/notification">
          <div className='listItem' >
            <NotificationsIcon className="item-icon"/>
            <span className="item-name">Notifications</span>
          </div>
        </Link>
        
        <div className='listItem' onClick={handleLogout}>
          <LogoutIcon className="item-icon"/>
          <span className="item-name">Logout</span>
        </div>
        
      </div>
    </div>
  );
};

export default Sidebar;
