"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  role: string;
  email: string;
  phone?: string;
  program?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  address?: string;
  profileImage?: string;
  studentId?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const storedAuth = localStorage.getItem("lmsAuth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.user) {
          setUser({
            ...parsed.user,
            name: parsed.user.name || parsed.user.username || parsed.user.email,
          });
          setToken(parsed.token || localStorage.getItem("lms_token"));
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed to parse auth data:", error);
        localStorage.removeItem("lmsAuth");
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
      }
    }

    const legacyUser = localStorage.getItem("lms_user");
    const legacyToken = localStorage.getItem("lms_token");
    if (legacyUser) {
      try {
        const parsed = JSON.parse(legacyUser);
        setUser({
          ...parsed,
          name: parsed.name || parsed.username || parsed.email,
        });
        setToken(legacyToken);
      } catch {
        localStorage.removeItem("lms_user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, tokenValue?: string) => {
    const normalizedUser = {
      ...userData,
      name: userData.name || userData.username || userData.email,
    };
    const newToken = tokenValue ?? token;

    setUser(normalizedUser);
    setToken(newToken ?? null);

    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      "lmsAuth",
      JSON.stringify({ token: newToken || "", user: normalizedUser })
    );
    if (newToken) {
      localStorage.setItem("lms_token", newToken);
    } else {
      localStorage.removeItem("lms_token");
    }
    localStorage.setItem("lms_user", JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("lmsAuth");
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
