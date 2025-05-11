

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  SignupResponseData,
} from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_BASE_URL = "/api/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const router = useRouter();

  // Login mutation
  const loginMutation = useMutation<
    AuthResponse<null>,
    Error,
    LoginCredentials
  >({
    mutationFn: async ({ email, password }) => {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Sets jwt cookie
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      const data = await response.json();
      try {
        router.push("/dashboard")
      } catch (error) {
        console.log(error)
      }
      localStorage.setItem("access_token" , data.data.access_token)
      return data;
    },
    onSuccess: () => {
      router.push("/dashboard");
      toast.success("Login successful", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Login failed" , {
        style: {
          backgroundColor: "red",
          color: "white",
        }
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation<
    AuthResponse<SignupResponseData>,
    Error,
    SignupCredentials
  >({
    mutationFn: async ({ email, password, confirmPassword, name }) => {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword, name }),
        credentials: "include", // Sets jwt cookie
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign Up failed");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Sign Up failed", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    },
  });

  const logoutMutation = useMutation<AuthResponse<null>, Error, void>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.removeQueries({ queryKey: ["profile"] });
      toast.success("Logout successful", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      router.push("/auth/login");
    }
  });

  return {
    login: loginMutation.mutate,
    loginStatus: {
      isPending: loginMutation.isPending,
      isSuccess: loginMutation.isSuccess,
      isError: loginMutation.isError,
      error: loginMutation.error,
      data: loginMutation.data,
    },
    signup: signupMutation.mutate,
    signupStatus: {
      isPending: signupMutation.isPending,
      isSuccess: signupMutation.isSuccess,
      isError: signupMutation.isError,
      error: signupMutation.error,
      data: signupMutation.data,
    },
    logout: logoutMutation.mutate,
    logoutStatus: {
      isPending: logoutMutation.isPending,
      isSuccess: logoutMutation.isSuccess,
      isError: logoutMutation.isError,
      error: logoutMutation.error,
      data: logoutMutation.data,
    },
  };
}
