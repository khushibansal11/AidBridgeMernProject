import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ isAdmin,children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading===true) {
    return ;
  }  
  if(!user){
    return;
  }
  else if (isAdmin && user.role !== "admin") {
    console.log(isAdmin,loading , user.role)
    return <Navigate to="/profile" />;
  }
  else if  (isAuthenticated===false) {
    return <Navigate to="/login" />;
  }

    return children;
  
};

export default ProtectedRoute;

