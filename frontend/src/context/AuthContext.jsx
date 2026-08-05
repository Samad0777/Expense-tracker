import { createContext, useState } from "react";
import { registerService, loginService } from "../services/auth.service";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerHandler = async (username, email, password) => {
    setLoading(true)
    try {
      const response = await registerService(username, email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginHandler = async (email, password) => {
    setLoading(true)
    try {
      const response = await loginService(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerHandler, loginHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
