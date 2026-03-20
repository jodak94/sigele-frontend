import axiosClient from './axiosClient';
import type { PaginatedResult } from '../types/user';
import type {
    CaptacionRecord,
    CreateCaptacionRequest,
    UpdateCaptacionRequest,
} from '../types/captacion';

export const getCaptaciones = (
    page: number,
    pageSize: number,
): Promise<PaginatedResult<CaptacionRecord>> =>
    axiosClient
        .get<PaginatedResult<CaptacionRecord>>('/captaciones', { params: { page, pageSize } })
        .then((r) => r.data);

export const createCaptacion = (
    data: CreateCaptacionRequest,
): Promise<CaptacionRecord> =>
    axiosClient.post<CaptacionRecord>('/captaciones', data).then((r) => r.data);

export const updateCaptacion = (
    id: number,
    data: UpdateCaptacionRequest,
): Promise<CaptacionRecord> =>
    axiosClient.patch<CaptacionRecord>(`/captaciones/${id}`, data).then((r) => r.data);

export const deleteCaptacion = (id: number): Promise<void> =>
    axiosClient.delete(`/captaciones/${id}`).then(() => undefined);

export const restoreCaptacion = (id: number): Promise<CaptacionRecord> =>
    axiosClient.post<CaptacionRecord>(`/captaciones/${id}/restore`).then((r) => r.data);
