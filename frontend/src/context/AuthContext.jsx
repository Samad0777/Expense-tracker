import { createContext, useState } from "react";
import { useEffect } from "react";
import {
  registerService,
  loginService,
  getMeService,
} from "../services/auth.service";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const registerHandler = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await registerService(username, email, password);
      setUser(response.data);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginHandler = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginService(email, password);
      setUser(response.data);
      console.log(response);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMeHandler = async () => {
    try {
      const response = await getMeService();
      setUser(response.data);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    getMeHandler();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerHandler,
        loginHandler,
        getMeHandler,
        authChecking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
