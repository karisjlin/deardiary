import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState
} from "react";
import { api, setAuthToken } from "../api/client";
import type { AuthResponse, User } from "../types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
  updateBio: (bio: string) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const storageKey = "redditclone.auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    const parsed = JSON.parse(stored) as AuthResponse;
    setAuthToken(parsed.token);
    startTransition(() => {
      setToken(parsed.token);
      setUser(parsed.user);
    });
  }, []);

  const persistAuth = (payload: AuthResponse) => {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    setAuthToken(payload.token);
    startTransition(() => {
      setToken(payload.token);
      setUser(payload.user);
    });
  };

  const signIn = async (payload: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/signin", payload);
    persistAuth(data);
  };

  const signUp = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    persistAuth(data);
  };

  const signOut = () => {
    localStorage.removeItem(storageKey);
    setAuthToken(null);
    startTransition(() => {
      setToken(null);
      setUser(null);
    });
  };

  const updateBio = (bio: string) => {
    if (!user || !token) return;
    const updated = { ...user, bio };
    localStorage.setItem(storageKey, JSON.stringify({ token, user: updated }));
    startTransition(() => setUser(updated));
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signUp, signOut, updateBio }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
