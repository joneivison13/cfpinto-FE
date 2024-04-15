import React from "react";

// import { Container } from './styles';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Customers from "./Screens/Customers";
import CustomerData from "./Screens/CustomerData";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Customers />,
  },
  {
    path: "/customer",
    element: <CustomerData />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);

const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
