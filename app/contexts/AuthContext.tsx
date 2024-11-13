import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthData, saveAuthData, clearAuthData } from "../utils/auth";

interface AuthContextProps {
  token: string | null;
  email: string | null;
  setAuthData: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      const { token, email } = await getAuthData();
      setToken(token);
      setEmail(email);
    };

    fetchAuthData();
  }, []);

  const setAuthData = async (newToken: string, newEmail: string) => {
    await saveAuthData(newToken, newEmail);
    setToken(newToken);
    setEmail(newEmail);
  };

  const logout = async () => {
    await clearAuthData();
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
