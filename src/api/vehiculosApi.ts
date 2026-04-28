import axiosClient from './axiosClient';
import type { Vehiculo, CreateVehiculoRequest, UpdateVehiculoRequest, VehiculosReporteData, VehiculoRequest, ResolveVehiculoRequestData } from '../types/vehiculo';
import type { PaginatedResult } from '../types/user';

export const getVehiculos = (page = 1, pageSize = 10): Promise<PaginatedResult<Vehiculo>> =>
    axiosClient.get<PaginatedResult<Vehiculo>>('/vehiculos', { params: { page, pageSize } }).then(r => r.data);

export const createVehiculo = (data: CreateVehiculoRequest): Promise<Vehiculo> =>
    axiosClient.post<Vehiculo>('/vehiculos', data).then(r => r.data);

export const updateVehiculo = (id: number, data: UpdateVehiculoRequest): Promise<void> =>
    axiosClient.put(`/vehiculos/${id}`, data).then(() => undefined);

export const deleteVehiculo = (id: number): Promise<void> =>
    axiosClient.delete(`/vehiculos/${id}`).then(() => undefined);

export const getVehiculoRequests = (page = 1, pageSize = 20): Promise<PaginatedResult<VehiculoRequest>> =>
    axiosClient.get<PaginatedResult<VehiculoRequest>>('/vehiculo-requests', { params: { page, pageSize } }).then(r => r.data);

export const aprobarVehiculoRequest = (id: number, data: ResolveVehiculoRequestData): Promise<void> =>
    axiosClient.post(`/vehiculo-requests/${id}/aprobar`, data).then(() => undefined);

export const rechazarVehiculoRequest = (id: number, data: ResolveVehiculoRequestData): Promise<void> =>
    axiosClient.post(`/vehiculo-requests/${id}/rechazar`, data).then(() => undefined);

export const getReporteVehiculos = (): Promise<VehiculosReporteData> =>
    axiosClient.get<VehiculosReporteData>('/reportes/vehiculos', { params: { formato: 'json' } }).then(r => r.data);

export const exportarReporteVehiculos = async (formato: 'xls' | 'pdf'): Promise<void> => {
    const response = await axiosClient.get('/reportes/vehiculos', {
        params: { formato },
        responseType: 'blob',
    });
    const ext = formato === 'xls' ? 'xlsx' : 'pdf';
    const mimeType = formato === 'xls'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
    const url = URL.createObjectURL(new Blob([response.data], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehiculos.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
};
