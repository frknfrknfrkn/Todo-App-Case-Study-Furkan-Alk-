import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password, captchaToken) => {
    try {
      const res = await axios.post("/login", { email, password, captchaToken });
      const newToken = res.data.token;
  
      if (newToken) {
        setToken(newToken);
        navigate("/dashboard");
      } else {
        alert("Giriş başarısız: Token alınamadı");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
      alert(errorMessage);
    }
  };  

  const logout = () => {
    setToken("");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}