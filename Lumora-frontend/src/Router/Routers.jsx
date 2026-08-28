import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import HomePage from "../Page/Home";
import Register from "../Page/Register";
import Login from "../Page/Login";
import Pricing from "../Page/Pricing";

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
]);

export default Routers;
