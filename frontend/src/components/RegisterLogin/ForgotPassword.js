import React, { useState,useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Loader from '../Layout/Loader'; 
import "./ForgotPassword.css"
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { clearErrors, forgotPassword, resetPassword } from '../../actions/userActions';

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const { error, message, loading } = useSelector( (state) => state.forgotPassword );

    const [email, setEmail] = useState('');

    const handleForgotPassword = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(() => {
        if (error) {
          toast.error(error);
          dispatch(clearErrors());
        }
    
        if (message) {
          toast.success(message);
        }
      }, [dispatch, error, message,toast]);

    return (
        loading ? <Loader /> :
        (
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleForgotPassword} method="post">
                        <div className="forgotPasswordEmail formGroup">
                            <EmailIcon className='icon' />
                            <input placeholder='E-mail' type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="forgotPasswordSubmit formGroup">
                            <input type="submit" value="Send Reset Link" />
                        </div>
                        <div className="formGroup changeForm">
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Handle reset password logic here
        const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(token, myForm));
    };

    useEffect(() => {
        if (error) {
          toast.error(error);
          dispatch(clearErrors());
        }
    
        if (success) {
          toast.success("Password Updated Successfully");
    
          navigate("/login");
        }
      }, [dispatch, error, navigate, success, toast]);

    return (
        loading ? <Loader /> :
        (
            <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                    <h2>Reset Password</h2>
                    <form onSubmit={handleResetPassword} method="post">
                        <div className="resetPasswordPassword formGroup">
                            <LockIcon className='icon' />
                            <input placeholder='New Password' type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="resetPasswordConfirmPassword formGroup">
                            <LockIcon className='icon' />
                            <input placeholder='Confirm Password' type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="resetPasswordSubmit formGroup">
                            <input type="submit" value="Reset Password" />
                        </div>
                        <div className="formGroup changeForm">
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export { ForgotPassword, ResetPassword };
