import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      navigate("/auth", { replace: true });
    };
    doLogout();
  }, []);

  return <p>Logging out...</p>;
};

export default Logout;