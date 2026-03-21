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
