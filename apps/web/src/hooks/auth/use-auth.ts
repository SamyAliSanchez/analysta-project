import { useMutation } from "@tanstack/react-query";
import {
  authApi,
  type RegisterDto,
  type LoginDto,
} from "../../lib/api/auth.api";
import { useAuthStore } from "../../lib/stores/auth.store";

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    clearAuth();
  };
};
