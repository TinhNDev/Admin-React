import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("userToken");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectRoute;
