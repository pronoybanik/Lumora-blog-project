import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import HomePage from "../Page/Home";
import Register from "../Page/Register";
import Login from "../Page/Login";
import Pricing from "../Page/Pricing";
import BlogList from "../Page/BlogList";
import BlogDetails from "../Page/BlogDetails";
import CreateBlogs from "../Page/CreateBlogs";
import AdminDashBoard from "../Page/admin/AdminDashBoard";
import Dashboard from "../Page/admin/DashBoard.jsx";
import BlogsPage from "../Page/admin/BlogsPage";
import UserPage from "../Page/admin/UserPage";
import ProfilePage from "../Page/ProfilePage.jsx";

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/blogList",
        element: <BlogList />,
      },
      {
        path: "/blog/:slug",
        element: <BlogDetails />,
      },
      {
        path: "/createBlogs",
        element: <CreateBlogs />,
      },
      {
        path: "/editBlog/:slug",
        element: <CreateBlogs />,
      },
      {
        path: "/profilePage",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/adminDashboard",
    element: <AdminDashBoard />,

    children: [
      {
        path: "/adminDashboard/dashboard",
        element: <Dashboard/>,
      },
      {
        path: "/adminDashboard/userPage",
        element: <UserPage/>,
      },
      {
        path: "/adminDashboard/BlogPage",
        element: <BlogsPage/>,
      },
    ],
  },
]);

export default Routers;
