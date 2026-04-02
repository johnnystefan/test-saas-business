import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../lib/api/auth.api';
import { useAuthStore } from '../../lib/stores/auth.store';
import type { LoginFormValues } from './auth.schema';

export function useLogin() {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((state) => state.login);

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ email, password }: LoginFormValues) =>
      login({ email, password }),
    onSuccess: (data) => {
      storeLogin({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      navigate('/', { replace: true });
    },
  });

  return {
    login: mutate,
    isLoading: isPending,
    error: error ? (error as Error).message : null,
  };
}
