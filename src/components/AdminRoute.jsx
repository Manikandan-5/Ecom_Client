import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

  const token =
    localStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user");

  const user =
    storedUser
      ? JSON.parse(storedUser)
      : null;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;