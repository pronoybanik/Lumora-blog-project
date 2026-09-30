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
import CategoriesPage from "../Page/admin/CategoriesPage.jsx";
import PaymentResult from "../Page/PaymentResult.jsx";
import PaymentFailed from "../Page/PaymentFailed.jsx";
import PaymentCancelled from "../Page/PaymentCancelled.jsx";

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
        path: "/blog/:id",
        element: <BlogDetails />,
      },
      {
        path: "/createBlogs",
        element: <CreateBlogs />,
      },
      {
        path: "/editBlog/:id",
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
  { path: "/payment-success", element: <PaymentResult /> },
  { path: "/failed", element: <PaymentFailed /> },
  { path: "/cancel", element: <PaymentCancelled /> },

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
      {
        path: "/adminDashboard/categories",
        element: <CategoriesPage />,
      },
    ],
  },
]);

export default Routers;
