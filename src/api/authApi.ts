import axiosClient from "./axiosClient";
import type { AuthResponse, LoginRequest } from "../types/auth";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', data);
    return response.data;
}