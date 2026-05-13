import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, ensureUserContext } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        console.log("🔍 Auth initialization - Token exists:", !!token);

        if (!token) {
          console.log("No token found - user will be created on first cart action");
          setUser(null);
          return;
        }

        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log("👤 Found saved user:", userData.username, "isGuest:", userData.isGuest, "role:", userData.role);

          if (!userData.isGuest) {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              if (payload.exp * 1000 < Date.now()) {
                console.log("⏰ Token expired, clearing auth");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("userRole");
                setUser(null);
                return;
              }
            } catch (e) {
              console.error("Error parsing token:", e);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("userRole");
              setUser(null);
              return;
            }
          }

          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

   
  const login = async ({ username, password }) => {
    try {
      const response = await authAPI.login({ username, password });
      const userData = JSON.parse(localStorage.getItem("user") || "null");

      if (userData) {
        setUser(userData);
        navigate(userData.role === "ADMIN" ? "/admin" : "/", { replace: true });
      } else {
        throw new Error("User data not found after login");
      }
    } catch (err) {
      throw err;
    }
  };
  const register = async (formData) => {
    try {
      console.log("📝 Register attempt with:", formData.username);
      const response = await authAPI.register(formData);
      console.log("✅ Registration successful:", response);

      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (userData) {
        setUser(userData);  
        navigate("/", { replace: true });
      } else {
        throw new Error("User data not found after registration");
      }
    } catch (err) {
      console.error("❌ Register error:", err);
      throw err;
    }
  };

  const guestLogin = async () => {
    try {
      console.log("👻 Creating guest user...");
      await ensureUserContext(true);
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (userData) {
        setUser(userData);
        console.log("✅ Guest user created:", userData);
        return userData;
      } else {
        throw new Error("Failed to create guest user");
      }
    } catch (err) {
      console.error("❌ Guest login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    console.log("🚪 Logging out...");
    authAPI.logout();
    setUser(null);  
    //navigate("/", { replace: true });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    guestLogin,
    isAuthenticated: user && !user.isGuest,
    isGuest: user?.isGuest || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};