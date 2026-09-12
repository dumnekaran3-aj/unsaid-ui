import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/api";
import { connectSocket, disconnectSocket } from "../config/socket";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const token = await AsyncStorage.getItem("unsaid_token");
      const userJson = await AsyncStorage.getItem("unsaid_user");
      if (token && userJson) {
        setUser(JSON.parse(userJson));
        connectSocket(token);
      }
    } catch (e) {
      console.log("Failed to load stored session:", e);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: loggedInUser } = res.data;
    await AsyncStorage.setItem("unsaid_token", token);
    await AsyncStorage.setItem("unsaid_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    connectSocket(token);
    return loggedInUser;
  }

  async function signup(name, email, password, gender) {
    const res = await api.post("/auth/signup", { name, email, password, gender });
    const { token, user: newUser } = res.data;
    await AsyncStorage.setItem("unsaid_token", token);
    await AsyncStorage.setItem("unsaid_user", JSON.stringify(newUser));
    setUser(newUser);
    connectSocket(token);
    return newUser;
  }

  async function logout() {
    await AsyncStorage.removeItem("unsaid_token");
    await AsyncStorage.removeItem("unsaid_user");
    disconnectSocket();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
