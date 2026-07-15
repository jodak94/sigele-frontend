import axiosClient from './axiosClient';
import type { AsistenciaElector, AsistenciaResumen } from '../types/asistencia';
import type { PaginatedResult } from '../types/user';

export const getAsistenciaList = (page = 1, pageSize = 10, search?: string): Promise<PaginatedResult<AsistenciaElector>> =>
    axiosClient.get<PaginatedResult<AsistenciaElector>>('/asistencia', { params: { page, pageSize, search: search || undefined } }).then(r => r.data);

export const getAsistenciaResumen = (): Promise<AsistenciaResumen> =>
    axiosClient.get<AsistenciaResumen>('/asistencia/resumen').then(r => r.data);

export const marcarAsistencia = (userId: number, cedula: number, asistio: boolean): Promise<void> =>
    axiosClient.patch(`/asistencia/${userId}/${cedula}`, { asistio }).then(() => undefined);
