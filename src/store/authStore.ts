import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSession, TenantConfig } from '../types/auth';

interface AuthState {
    accessToken: string | null,
    refreshToken: string | null,
    user: UserSession | null,
    tenantConfig: TenantConfig | null;
    isAuthenticated: boolean;
    mustChangePassword: boolean;
    setAuth: (accessToken: string, refreshToken: string, user: UserSession, mustChangePassword: boolean, tenantConfig: TenantConfig) => void;
    clearMustChangePassword: () => void;
    updateTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            tenantConfig: null,
            isAuthenticated: false,
            mustChangePassword: false,

            setAuth: (accessToken, refreshToken, user, mustChangePassword, tenantConfig) =>
                set({ accessToken, refreshToken, user, isAuthenticated: true, mustChangePassword, tenantConfig }),

            clearMustChangePassword: () =>
                set({ mustChangePassword: false }),

            updateTokens: (accessToken, refreshToken) =>
                set({ accessToken, refreshToken }),

            logout: () =>
                set({ accessToken: null, refreshToken: null, user: null, tenantConfig: null, isAuthenticated: false, mustChangePassword: false }),

            hasPermission: (permission) =>
                get().user?.permissions.includes(permission) ?? false,
        }),
        {
            name: 'auth-storage',
        }
    )
)