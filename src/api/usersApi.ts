import axiosClient from "./axiosClient";
import type { PaginatedResult, UserListItem } from "../types/user";

export const getOperators = async (
    page: number,
    pageSize: number,
): Promise<PaginatedResult<UserListItem>> => {
    const response = await axiosClient.get<PaginatedResult<UserListItem>>(
        `/users?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
}