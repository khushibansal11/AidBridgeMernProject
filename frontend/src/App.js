import React, { useEffect } from 'react';
import WebFont from "webfontloader";
import { Toaster } from 'react-hot-toast';
import store from "./store.js"
import "./app.css"
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import {ForgotPassword, ResetPassword} from './components/RegisterLogin/ForgotPassword';
import CompleteProfile from './components/RegisterLogin/CompleteProfile.js';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from "./components/Route/ProtectedRoute.js"
import { loadUser } from './actions/userActions';
import Profile from './components/User/Profile.js'
import UpdateProfile from './components/User/UpdateProfile.js'
import AddSkill from './components/User/AddSkill.js'
import ChangePassword from './components/User/ChangePassword.js'
import Home from './components/Home/Home.js';
import PostProblem from "./components/Problems/PostProblem.js"
import SearchHelpers from "./components/Problems/SearchHelpers.js"
import ProblemDashboard from "./components/Problems/ProblemDashboard.js"
import SearchProblems from "./components/Helpers/SearchProblems.js"
import HelperApplications from "./components/Helpers/HelperApplications.js"
import Notifications from "./components/Notifications/Notifications.js"
import Chat from './components/Chat/Chat.js';
import AdminDashboard from './components/Admin/AdminDashboard.js';
import UsersList from './components/Admin/UsersList.js';
import UpdateUser from "./components/Admin/UpdateUser.js";
import SendNotification from './components/Admin/SendNotification.js';
import NotFound from './components/Layout/NotFound.js';

const App = () => {
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Noto Sans","Poppins","Mukta","Lora"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  return (
    <div>
      <Toaster position="bottom-center"/>
      <Router>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<RegisterLogin/>} />
        <Route path="/password/forgot" element={<ForgotPassword /> }/>
        <Route path="/password/reset/:token" element={<ResetPassword /> }/>

        <Route path="/profile/complete" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path='/profile/:id' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route exact path='/me/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route exact path='/password/change' element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route exact path='/post' element={<ProtectedRoute><PostProblem /></ProtectedRoute>} />
        <Route exact path='/problems/dashboard' element={<ProtectedRoute><ProblemDashboard /></ProtectedRoute>} />
        <Route exact path='/addSkill' element={<ProtectedRoute><AddSkill /></ProtectedRoute>} />
        <Route path='/search-helpers/:id' element={<ProtectedRoute><SearchHelpers /></ProtectedRoute>} />
        <Route exact path='/search-problems' element={<ProtectedRoute><SearchProblems /></ProtectedRoute>} />
        <Route exact path='/applications' element={<ProtectedRoute><HelperApplications /></ProtectedRoute>} />
        <Route exact path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path='/chat/:id' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} />
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
        <Route path='/admin/notification' element={<ProtectedRoute isAdmin={true}><SendNotification /></ProtectedRoute>} />
        <Route path="/*" element={<NotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
