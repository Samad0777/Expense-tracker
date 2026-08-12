import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import AuthContextProvider from "./context/AuthContext";
import TransactionsContextProvider from "./context/TransactionsContext";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <TransactionsContextProvider>
          <RouterProvider router={router} />
        </TransactionsContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default App;
