import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminDashBoard = () => {
  return (
    <div>
      <AdminNavbar  />
      {/* <Outlet /> */}
    </div>
  );
};

export default AdminDashBoard;
