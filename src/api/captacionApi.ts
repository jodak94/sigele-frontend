import axiosClient from './axiosClient';
import type {
    CaptacionRecord,
    CreateCaptacionRequest,
    UpdateCaptacionRequest,
    ReporteElectoresResponse,
    ReporteResumenOperadoresResponse,
    ReporteDiaDResponse,
    ReporteCandidatosMesaResponse,
    ElectorUbicacion,
} from '../types/captacion';

export const getElectoresUbicaciones = (): Promise<ElectorUbicacion[]> =>
    axiosClient.get<ElectorUbicacion[]>('/operadores/electores/ubicaciones').then((r) => r.data);

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

export const exportarElectores = async (formato: 'xls' | 'pdf'): Promise<void> => {
    const response = await axiosClient.get(`/reportes/electores-por-operador`, {
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
    link.download = `electores.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
};

export const getReporteResumenOperadores = (coordinadorId?: number): Promise<ReporteResumenOperadoresResponse> =>
    axiosClient
        .get<ReporteResumenOperadoresResponse>('/reportes/resumen-operadores', {
            params: { formato: 'json', ...(coordinadorId ? { coordinadorId } : {}) },
        })
        .then((r) => r.data);

export const exportarReporteResumenOperadores = async (
    formato: 'xls' | 'pdf',
    coordinadorId?: number,
    nombre = 'coordinador',
): Promise<void> => {
    const response = await axiosClient.get('/reportes/resumen-operadores', {
        params: { formato, ...(coordinadorId ? { coordinadorId } : {}) },
        responseType: 'blob',
    });
    const ext = formato === 'xls' ? 'xlsx' : 'pdf';
    const mimeType = formato === 'xls'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
    const url = URL.createObjectURL(new Blob([response.data], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumen-${nombre.replace(/\s+/g, '_')}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
};

export const getReporteElectores = (operadorId: number): Promise<ReporteElectoresResponse> =>
    axiosClient
        .get<ReporteElectoresResponse>('/reportes/electores-por-operador', {
            params: { formato: 'json', operadorId },
        })
        .then((r) => r.data);

export const getReporteDiaD = (): Promise<ReporteDiaDResponse> =>
    axiosClient
        .get<ReporteDiaDResponse>('/reportes/dia-d', { params: { formato: 'json' } })
        .then((r) => r.data);

export const exportarReporteDiaD = async (formato: 'xls' | 'pdf'): Promise<void> => {
    const response = await axiosClient.get('/reportes/dia-d', {
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
    link.download = `dia-d.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
};

export const getReporteCandidatosMesa = (): Promise<ReporteCandidatosMesaResponse> =>
    axiosClient
        .get<ReporteCandidatosMesaResponse>('/reportes/candidatos-mesa', { params: { formato: 'json' } })
        .then((r) => r.data);

export const exportarReporteCandidatosMesa = async (formato: 'xls' | 'pdf'): Promise<void> => {
    const response = await axiosClient.get('/reportes/candidatos-mesa', {
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
    link.download = `candidatos-mesa.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportarReporteElectores = async (
    operadorId: number,
    formato: 'xls' | 'pdf',
    operadorNombre: string,
): Promise<void> => {
    const response = await axiosClient.get('/reportes/electores-por-operador', {
        params: { formato, operadorId },
        responseType: 'blob',
    });
    const ext = formato === 'xls' ? 'xlsx' : 'pdf';
    const mimeType = formato === 'xls'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
    const url = URL.createObjectURL(new Blob([response.data], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `planilla-${operadorNombre.replace(/\s+/g, '_')}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
};
