import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import AuthContextProvider from "./context/AuthContext";

const App = () => {

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  );
};

export default App;
