export interface UserListItem {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    lastLogin: string | null;
    createdAt: string;
}

export interface CoordinatorListItem {
    id: number;
    fullName: string;
}

export interface CreateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    coordinatorId?: number;
    temporaryPassword: string;
}

export interface PaginatedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}