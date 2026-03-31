export interface UserSession {
    id: number;
    fullName: string;
    email: string;
    role: string;
    mustChangePassword: boolean;
    permissions: string[];
}

export interface TenantConfig {
    soportaUbicacion: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: UserSession;
    tenantConfig: TenantConfig;
}

export interface LoginRequest {
    email: string;
    password: string;
}