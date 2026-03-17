export interface UserListItem {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    lastLogin: string | null;
    createdAt: string;
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