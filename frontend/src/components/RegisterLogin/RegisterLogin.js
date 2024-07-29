// src/components/RegisterLogin.js
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, clearErrors } from '../../actions/userActions';
import './RegisterLogin.css';
import avatarImg from "../../images/Profile.png"
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import Loader from '../Layout/Loader';
import { toast} from 'react-hot-toast';

const convertToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

const RegisterLogin = () => {

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(avatarImg);
    const [role, setRole] = useState("");
    const [loginEmail,setLoginEmail]=useState("");
    const [loginPassword,setLoginPassword]=useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated , user } = useSelector((state) => state.user);

    const toggleForm = () => {
        setIsRegister(!isRegister);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);
        formData.set('role', role);

        dispatch(register(formData));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    };

    const handleAvatar=async(e)=>{
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            const file = e.target.files[0];
            let finalFile = file;
            if (!file) {
                setAvatar(avatarImg);
                return;
              }
            if(file && file.size > 500 * 1024){
              const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920, 
                useWebWorker: true, 
              };
              finalFile = await imageCompression(file, options);
            }
            reader.onload = () => {
              if (reader.readyState === 2) {
                setAvatar(reader.result);
                setAvatar(reader.result);
              }
            };
            reader.readAsDataURL(finalFile);
          }
    }
    useEffect(() => {
        if (error) {
          toast.error(error);
          dispatch(clearErrors());
        }
        if(user && user.role && user.role === "admin"){
            navigate("/admin/dashboard");
        }
        else if (isAuthenticated){
            navigate("/profile/complete");
        }
        if (avatar === avatarImg) {
          convertToBase64(avatar, (result) => {
            setAvatar(result);
          });
        }
      }, [error,avatar,isAuthenticated,navigate,dispatch]);

    return (
        loading?<Loader/>:
        (
            <div className="registerLoginContainer">
                {/* <div className="frontImg"  style={{ height: isRegister ? "69%" : "49%" }}>
                    <img src={logo} alt="Logo" />
                </div> */}
            <div className="registerLoginBox">
                {isRegister ? (
                    <div className="registerForm">
                        <h2>Register</h2>
                        <form onSubmit={handleRegister} encType="multipart/form-data">
                            <div className="registerName formGroup">
                                <PersonIcon className='icon' />
                                <input type="text" id="name" name="name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="registerEmail formGroup">
                                <EmailIcon className='icon' />
                                <input type="email" id="email" placeholder='E-mail' name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="registerPassword formGroup">
                                <LockIcon className='icon' />
                                <input type="password" id="password" placeholder='Password' name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="registerAvatar formGroup">
                                <img src={avatar} alt="Avatar Preview" />
                                <input type="file" accept="image/*" name="avatar" onChange={handleAvatar} />
                            </div>
                            <div className="registerRole formGroup">
                                <select id="role" name="role" onChange={(e) => setRole(e.target.value)}  required>
                                    <option disabled selected value> -- select your role -- </option>
                                    <option value="Helper">Helper</option>
                                    <option value="Seeker">Seeker</option>
                                </select>
                            </div>
                            <div className="registerSubmit formGroup">
                                <input type="submit" value="Register" />
                            </div>
                            <div className="formGroup changeForm">
                                <button type="button" onClick={toggleForm}>Already have an account?Login</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="loginForm">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin} method="post">
                            <div className="loginName formGroup">
                                <EmailIcon className='icon' />
                                <input placeholder='E-mail' type="email" id="email" name="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                            </div>
                            <div className="loginPassword formGroup">
                                <LockIcon className='icon' />
                                <input placeholder="Password" type="password" id="password" name="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                            </div>
                            <div className="formGroup registerForgot">
                                <Link to="/password/forgot" >Forgot Password?</Link>
                            </div>
                            <div className="loginSubmit formGroup">
                                <input type="submit" value="Login" />
                            </div>
                            <div className="formGroup changeForm">
                                <button type="button" onClick={toggleForm}>Don't have an account? Register</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
        )
    );
};

export default RegisterLogin;
