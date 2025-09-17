// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const login = (username, password) => {
    // Qui puoi mettere la tua logica reale di login
    if (username === "admin" && password === "password123") {
      setIsAdmin(true);
      navigate("/gestione"); // reindirizza dopo login
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    navigate("/"); // torna alla scan page
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
