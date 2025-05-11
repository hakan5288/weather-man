export interface AuthResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface LoginResponseData {
  access_token: string;
}

export interface SignupResponseData {
  id: string;
  email: string;
  name: string;
  errors: string[] | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}
