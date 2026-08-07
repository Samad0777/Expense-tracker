import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Analytics from "../pages/Analytics"
import Settings from "../pages/Settings"
import MainLayout from "../components/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<MainLayout/>,
    children:[
      {
        path:"/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/transactions",
        element:<Transactions/>
      },
      {
        path:"/analytics",
        element:<Analytics/>
      },
      {
        path:"/settings",
        element:<Settings/>
      },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
