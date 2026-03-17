export interface UserSession {
    id: number;
    fullName: string;
    email: string;
    role: string;
    permissions: string[];
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: UserSession;
}

export interface LoginRequest {
    email: string;
    password: string;
    tenantId: number;
}