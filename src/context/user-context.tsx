"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        console.log("Access token:", token ? "Found" : "Not found");

        if (!token) {
          setUser(null);
          setError("No access token found.");
          return;
        }

        const API_URL = "api/auth";

        const response = await fetch(`${API_URL}/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            setError("Invalid or expired token. Please log in again.");
            setUser(null);
          } else {
            throw new Error(
              `API error: ${response.statusText} (${response.status})`
            );
          }
          return;
        }

        const data = await response.json();
        setUser(data.data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
