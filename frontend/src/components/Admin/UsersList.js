import React, { Fragment, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./userList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "../Admin/AdminLayout/sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import toast from "react-hot-toast";

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, users } = useSelector((state) => state.allUsers);

  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, navigate, isDeleted, message]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.7 },
    { field: "email", headerName: "Email", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 130, flex: 0.5 },
    {
      field: "role",
      headerName: "Role",
      minWidth: 100,
      flex: 0.3,
      cellClassName: (params) => {
        return params.row.role === "admin" ? "greenColor" : params.row.role === "Helper" ? "blueColor" : "redColor";
      },
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteUserHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const seekerRows = [];
  const helperRows = [];
  const adminRows = [];

  users &&
    users.forEach((item) => {
      const row = {
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      };

      if (item.role === "Seeker") {
        seekerRows.push(row);
      } else if (item.role === "Helper") {
        helperRows.push(row);
      } else if (item.role === "admin") {
        adminRows.push(row);
      }
    });

  return (
    <div className="main">
      <SideBar />
      <div className="userListContainer">
        <h1 id="userListHeading">ALL USERS</h1>
        
        <h2>Seekers</h2>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={seekerRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            className="userListTable"
            autoHeight
            pagination
          />
        </div>

        <h2>Helpers</h2>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={helperRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            className="userListTable"
            autoHeight
            pagination
          />
        </div>

        <h2>Admins</h2>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={adminRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            className="userListTable"
            autoHeight
            pagination
          />
        </div>
      </div>
    </div>
  );
};

export default UsersList;
