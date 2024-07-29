import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, clearErrors } from '../../actions/userActions';
import '../RegisterLogin/RegisterLogin.css';
import LockIcon from '@mui/icons-material/Lock';
import { toast } from 'react-hot-toast';
import Loader from '../Layout/Loader';
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.jpg";
import { CHANGE_PASSWORD_RESET } from '../../constants/userConstants';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isPasswordChanged } = useSelector((state) => state.profile);

  const handleChangePassword = (e) => {
    e.preventDefault();

    dispatch(changePassword(oldPassword,newPassword,confirmPassword));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isPasswordChanged) {
      toast.success("Password changed successfully");
      navigate("/profile");
      dispatch({type: CHANGE_PASSWORD_RESET})
    }
  }, [error, isPasswordChanged, navigate, dispatch]);

  return (
    loading ? <Loader /> : (
      <div className="registerLoginContainer">
        {/* <div className="frontImg" style={{ height: "52.6%" }}>
          <img src={logo} alt="Logo" />
        </div> */}
        <div className="registerLoginBox">
          <div className="loginForm">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword} method="post">
              <div className="loginPassword formGroup">
                <LockIcon className='icon' />
                <input placeholder="Old Password" type="password" id="oldPassword" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
              </div>
              <div className="loginPassword formGroup">
                <LockIcon className='icon' />
                <input placeholder="New Password" type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="loginPassword formGroup">
                <LockIcon className='icon' />
                <input placeholder="Confirm New Password" type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="loginSubmit formGroup">
                <input type="submit" value="Change Password" />
              </div>
              <div className="formGroup changeForm">
                <Link to="/profile">Back to Profile</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default ChangePassword;
