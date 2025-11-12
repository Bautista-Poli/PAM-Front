import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { UserData } from "@/components/apiConnections/types";
import { postLogin } from "@/components/apiConnections/apileagues";

type AuthState = {
  isBooting: boolean;
  user: UserData | null;
  login: (p: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setFromCreate: (p: { user: UserData }) => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    (async () => {
      const rawUser = await SecureStore.getItemAsync("user");
      if (rawUser) {
        try {
          setUser(JSON.parse(rawUser) as UserData);
        } catch {
          await SecureStore.deleteItemAsync("user");
        }
      }
      setIsBooting(false);
    })();
  }, []);

  const login: AuthState["login"] = async ({ email, password }) => {
    await SecureStore.deleteItemAsync("user");
    
    const loggedInUser = await postLogin(email, password); // <- devuelve UserData | null
    if (!loggedInUser) throw new Error("Credenciales inválidas o error de conexión.");

    await SecureStore.setItemAsync("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("user");
    setUser(null);
  };

  const setFromCreate: AuthState["setFromCreate"] = async ({ user }) => {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    setUser(user);
  };

  return (
    <AuthCtx.Provider value={{ isBooting, user, login, logout, setFromCreate }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}

export function useAuthUser(): UserData {
  const { user } = useAuth();
  if (!user) throw new Error("No hay usuario autenticado");
  return user;
}

