import axiosClient from './axiosClient';
import type { AuditoriaPoint, AlertaItem, AlertaCaptacion } from '../types/auditoria';

export const getAuditoriaMapaOperador = (operadorId: number): Promise<AuditoriaPoint[]> =>
    axiosClient
        .get<AuditoriaPoint[]>('/auditoria/mapa', { params: { operadorId } })
        .then((r) => r.data);

export const getAuditoriaAlertas = (): Promise<AlertaItem[]> =>
    axiosClient.get<AlertaItem[]>('/auditoria/alertas').then((r) => r.data);

export const getAuditoriaOperadorCaptaciones = (operadorId: number, tipoAlerta: string): Promise<AlertaCaptacion[]> =>
    axiosClient
        .get<AlertaCaptacion[]>(`/auditoria/operador/${operadorId}/captaciones`, { params: { tipo_alerta: tipoAlerta } })
        .then((r) => r.data);
