import axiosClient from './axiosClient';
import type {
    CaptacionRecord,
    CreateCaptacionRequest,
    UpdateCaptacionRequest,
} from '../types/captacion';

export const getCaptaciones = (operadorId: number): Promise<CaptacionRecord[]> =>
    axiosClient
        .get<CaptacionRecord[]>(`/operadores/${operadorId}/electores`)
        .then((r) => r.data);

export const createCaptacion = (
    data: CreateCaptacionRequest,
): Promise<CaptacionRecord> =>
    axiosClient.post<CaptacionRecord>('/operadores/electores', data).then((r) => r.data);

export const updateCaptacion = (
    electorId: number,
    data: UpdateCaptacionRequest,
): Promise<CaptacionRecord> =>
    axiosClient.put<CaptacionRecord>(`/operadores/electores/${electorId}`, data).then((r) => r.data);

export const deleteCaptacion = (electorId: number): Promise<void> =>
    axiosClient.delete(`/operadores/electores/${electorId}`).then(() => undefined);

export const restoreCaptacion = (electorId: number): Promise<CaptacionRecord> =>
    axiosClient.post<CaptacionRecord>(`/operadores/electores/${electorId}/restore`).then((r) => r.data);
