import { useAuth } from "../hook/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authChecking } = useAuth();

  if (authChecking) {
    return (
      <div className="flex items-center justify-center">
        <h2>authChecking...</h2>
      </div>
    );
  }

  if (user) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
