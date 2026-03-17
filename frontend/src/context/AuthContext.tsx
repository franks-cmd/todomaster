import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'LOGIN_SUCCESS'; user: User; token: string }
  | { type: 'LOGOUT' };

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'LOGIN_SUCCESS':
      return { user: action.user, token: action.token, loading: false };
    case 'LOGOUT':
      return { user: null, token: null, loading: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', loading: false });
      return;
    }
    authService
      .getMe()
      .then(({ user }) => dispatch({ type: 'LOGIN_SUCCESS', user, token }))
      .catch(() => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN_SUCCESS', user, token });
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { token, user } = await authService.register(email, password, name);
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', user, token });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
