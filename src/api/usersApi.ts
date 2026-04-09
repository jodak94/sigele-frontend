import axiosClient from "./axiosClient";
import type { PaginatedResult, UserListItem, CoordinatorListItem, CreateUserRequest, Role } from "../types/user";

export const getOperators = async (
    page: number,
    pageSize: number,
): Promise<PaginatedResult<UserListItem>> => {
    const response = await axiosClient.get<PaginatedResult<UserListItem>>(
        `/users?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
}

export const searchOperadores = async (nombre: string): Promise<PaginatedResult<UserListItem>> => {
    const response = await axiosClient.get<PaginatedResult<UserListItem>>('/users', {
        params: { Page: 1, PageSize: 5, nombre },
    });
    return response.data;
}

export const getCoordinators = async (): Promise<CoordinatorListItem[]> => {
    const response = await axiosClient.get<CoordinatorListItem[]>('/users/coordinators');
    return response.data;
}

export const getRoles = async (): Promise<Role[]> => {
    const response = await axiosClient.get<Role[]>('/roles');
    return response.data;
}

export const createUser = async (data: CreateUserRequest): Promise<UserListItem> => {
    const response = await axiosClient.post<UserListItem>('/users', data);
    return response.data;
}

export const getAllUsers = async (
    page: number,
    pageSize: number,
    nombre?: string,
): Promise<PaginatedResult<UserListItem>> => {
    const response = await axiosClient.get<PaginatedResult<UserListItem>>('/users/all', {
        params: { page, pageSize, ...(nombre ? { nombre } : {}) },
    });
    return response.data;
}

export const adminResetPassword = async (userId: number): Promise<void> => {
    await axiosClient.post(`/users/${userId}/admin-reset-password`, { provisionalPassword: 'SGELE-2026!' });
}

export const changePassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string,
): Promise<void> => {
    await axiosClient.post(`/users/${userId}/password`, { currentPassword, newPassword });
}