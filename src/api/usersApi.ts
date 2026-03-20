import axiosClient from "./axiosClient";
import type { PaginatedResult, UserListItem, CoordinatorListItem, CreateUserRequest } from "../types/user";

export const getOperators = async (
    page: number,
    pageSize: number,
): Promise<PaginatedResult<UserListItem>> => {
    const response = await axiosClient.get<PaginatedResult<UserListItem>>(
        `/users?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
}

export const getCoordinators = async (): Promise<CoordinatorListItem[]> => {
    const response = await axiosClient.get<CoordinatorListItem[]>('/users/coordinators');
    return response.data;
}

export const createUser = async (data: CreateUserRequest): Promise<UserListItem> => {
    const response = await axiosClient.post<UserListItem>('/users', data);
    return response.data;
}