import React, { useState, useEffect } from 'react';
import "./UpdateUser.css"
import { useParams, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Loader from '../Layout/Loader';
import { getUserDetails,
    updateUser,
    clearErrors, } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import toast from 'react-hot-toast';

const UpdateUser = () => {
    const navigate=useNavigate();
    const {id} = useParams();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = id;


  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, toast, error, navigate, isUpdated, updateError, user, userId]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };


    return (
        loading ? <Loader /> :
        (
            <div className="adminUpdateUserContainer">
                <div className="adminUpdateUserBox">
                    <h2>Update User</h2>
                    <form onSubmit={handleUpdate} method="post">
                        <div className="updateUserName formGroup">
                            <PersonIcon className='icon' />
                            <input placeholder='Name' type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="updateUserEmail formGroup">
                            <EmailIcon className='icon' />
                            <input placeholder='E-mail' type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="updateUserRole formGroup">
                            <AdminPanelSettingsIcon className='icon' />
                            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option disabled value=""> -- select a role -- </option>
                                <option value="Helper">Helper</option>
                                <option value="Seeker">Seeker</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="updateUserSubmit formGroup">
                            <input type="submit" value="Update" />
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default UpdateUser;
