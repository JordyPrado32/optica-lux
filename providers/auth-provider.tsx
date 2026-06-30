import { createContext, ReactNode, useState } from 'react';

import { apiRequest, resolveApiUrl } from '@/services/api';
import { LoginResponse, UserProfile } from '@/types/auth';

type AuthContextValue = {
  apiBaseUrl: string;
  bootstrapping: boolean;
  busy: boolean;
  pendingMfaToken: string | null;
  token: string | null;
  user: UserProfile | null;
  setApiBaseUrl: (value: string) => void;
  login: (identifier: string, password: string) => Promise<'authenticated' | 'mfa' | 'must-change-password'>;
  verifyMfa: (code: string) => Promise<'authenticated' | 'must-change-password'>;
  register: (payload: Record<string, string>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (payload: Record<string, string>) => Promise<void>;
  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  setupMfa: () => Promise<{ secret: string; otpauthUrl?: string }>;
  enableMfa: (code: string) => Promise<void>;
  disableMfa: (code: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const initialApiUrl = resolveApiUrl(process.env.EXPO_PUBLIC_API_URL);

function compactPayload(payload: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value.trim() !== '')
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pendingMfaToken, setPendingMfaToken] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrlState] = useState(initialApiUrl);
  const [busy, setBusy] = useState(false);

  function setApiBaseUrl(value: string) {
    setApiBaseUrlState(resolveApiUrl(value));
  }

  async function withBusy<T>(callback: () => Promise<T>) {
    setBusy(true);
    try {
      return await callback();
    } finally {
      setBusy(false);
    }
  }

  async function login(identifier: string, password: string) {
    return withBusy(async () => {
      const response = await apiRequest<LoginResponse>(apiBaseUrl, '/auth/login', {
        method: 'POST',
        body: { identifier, password },
      });

      if (response.requiresMfa) {
        setPendingMfaToken(response.mfaToken);
        return 'mfa';
      }

      setToken(response.token);
      setUser(response.user);
      setPendingMfaToken(null);
      return response.user.security.must_change_password ? 'must-change-password' : 'authenticated';
    });
  }

  async function verifyMfa(code: string) {
    return withBusy(async () => {
      if (!pendingMfaToken) {
        throw new Error('No hay un ticket MFA pendiente');
      }

      const response = await apiRequest<{ token: string; user: UserProfile }>(apiBaseUrl, '/auth/login/mfa', {
        method: 'POST',
        body: {
          code,
          mfaToken: pendingMfaToken,
        },
      });

      setToken(response.token);
      setUser(response.user);
      setPendingMfaToken(null);
      return response.user.security.must_change_password ? 'must-change-password' : 'authenticated';
    });
  }

  async function register(payload: Record<string, string>) {
    return withBusy(async () => {
      const response = await apiRequest<{ token: string; user: UserProfile }>(apiBaseUrl, '/auth/register', {
        method: 'POST',
        body: compactPayload(payload),
      });

      setToken(response.token);
      setUser(response.user);
    });
  }

  async function forgotPassword(email: string) {
    return withBusy(async () => {
      await apiRequest(apiBaseUrl, '/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
    });
  }

  async function resetPassword(resetToken: string, password: string) {
    return withBusy(async () => {
      await apiRequest(apiBaseUrl, '/auth/reset-password', {
        method: 'POST',
        body: { token: resetToken, password },
      });
    });
  }

  async function refreshProfile(currentToken: string) {
    const profile = await apiRequest<UserProfile>(apiBaseUrl, '/profile/me', {
      token: currentToken,
    });
    setUser(profile);
  }

  async function updateProfile(payload: Record<string, string>) {
    return withBusy(async () => {
      if (!token) {
        throw new Error('Sesión no disponible');
      }

      const profile = await apiRequest<UserProfile>(apiBaseUrl, '/profile/me', {
        method: 'PATCH',
        token,
        body: compactPayload(payload),
      });
      setUser(profile);
    });
  }

  async function changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return withBusy(async () => {
      if (!token) {
        throw new Error('Sesión no disponible');
      }

      await apiRequest(apiBaseUrl, '/auth/change-password', {
        method: 'POST',
        token,
        body: payload,
      });

      await refreshProfile(token);
    });
  }

  async function setupMfa() {
    return withBusy(async () => {
      if (!token) {
        throw new Error('Sesión no disponible');
      }

      return apiRequest<{ secret: string; otpauthUrl?: string }>(apiBaseUrl, '/auth/mfa/setup', {
        method: 'POST',
        token,
      });
    });
  }

  async function enableMfa(code: string) {
    return withBusy(async () => {
      if (!token) {
        throw new Error('Sesión no disponible');
      }

      await apiRequest(apiBaseUrl, '/auth/mfa/enable', {
        method: 'POST',
        token,
        body: { code },
      });

      await refreshProfile(token);
    });
  }

  async function disableMfa(code: string) {
    return withBusy(async () => {
      if (!token) {
        throw new Error('Sesión no disponible');
      }

      await apiRequest(apiBaseUrl, '/auth/mfa/disable', {
        method: 'POST',
        token,
        body: { code },
      });

      await refreshProfile(token);
    });
  }

  function logout() {
    setToken(null);
    setUser(null);
    setPendingMfaToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        apiBaseUrl,
        bootstrapping: false,
        busy,
        pendingMfaToken,
        token,
        user,
        setApiBaseUrl,
        login,
        verifyMfa,
        register,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        setupMfa,
        enableMfa,
        disableMfa,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
