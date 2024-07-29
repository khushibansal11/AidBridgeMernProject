import React, { useEffect } from 'react';
import './Sidebar.css';
import logo from "../../images/logo.jpg";
import { useDispatch, useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from "react-router-dom";
import { logout, clearErrors } from "../../actions/userActions";
import { toast } from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import { CLEAR_CHAT } from '../../constants/chatConstants';

const Sidebar = () => {
  const { error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged Out Successfully");
  };
  const clearChat=()=>{
    dispatch({type: CLEAR_CHAT})
  }
  
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
        
        {user.role === "Seeker" ?
          <Link to="/problems/dashboard">
            <div className='listItem'>
              <DashboardIcon className="item-icon"/>
              <span className="item-name">Dashboard</span>
            </div>
          </Link>
          :
          <Link to="/applications">
            <div className='listItem'>
              <AssignmentTurnedInIcon className="item-icon"/>
              <span className="item-name">My Applications</span>
            </div>
          </Link>
        }
        
        {user.role === "Seeker" ?
          <Link to="/post">
            <div className='listItem'>
              <AddBoxOutlinedIcon className="item-icon"/>
              <span className="item-name">Post A Problem</span>
            </div>
          </Link>
          :
          <Link to="/search-problems">
            <div className='listItem'>
              <SearchIcon className="item-icon"/>
              <span className="item-name">Search Problems</span>
            </div>
          </Link>
        }
        
        <Link to="/chat">
          <div className='listItem'>
            <ChatIcon className="item-icon"/>
            <span className="item-name">Chats</span>
          </div>
        </Link>
        <Link to="/notifications">
          <div className='listItem' onClick={()=>clearChat()}>
            <NotificationsIcon className="item-icon"/>
            <span className="item-name">Notifications</span>
          </div>
        </Link>
        
        <Link to="/profile">
          <div className='listItem'>
            {/* <span className="item-icon profileAvatarContainer"> */}
              <img src={user.avatar.url} alt="profile" />
            {/* </span> */}
            <span className="item-name">Profile</span>
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
