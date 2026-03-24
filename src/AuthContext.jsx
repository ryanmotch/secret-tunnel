// eslint-disable-next-line react-refresh/only-export-components
import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // Step 1: signup
  const signup = async (username) => {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setToken(data.token);      
    setLocation("TABLET");     
  };

  // Step 2: authenticate
  const authenticate = async () => {
    if (!token) throw new Error("No token found!");

    const res = await fetch(`${API}/authenticate`, {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setLocation("TUNNEL");     
  };

  const value = { location, signup, authenticate }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
