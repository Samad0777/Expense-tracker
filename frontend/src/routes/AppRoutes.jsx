import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login"/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
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
