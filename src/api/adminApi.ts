import axiosClient from './axiosClient';
import type { AdminKpis, OperatorStats, VoterSearchResult, CoordinatorPerformance, BarrioStat, ConsultasStats } from '../types/admin';

export const getAdminKpis = (): Promise<AdminKpis> =>
    axiosClient.get<AdminKpis>('/admin/kpis').then((r) => r.data);

export const getOperatorStats = (): Promise<OperatorStats[]> =>
    axiosClient.get<OperatorStats[]>('/admin/operators').then((r) => r.data);

export const searchVoterByCedula = (cedula: string): Promise<VoterSearchResult> =>
    axiosClient
        .get<VoterSearchResult>('/admin/search', { params: { cedula } })
        .then((r) => r.data);

export const getCoordinatorStats = (): Promise<CoordinatorPerformance[]> =>
    axiosClient.get<CoordinatorPerformance[]>('/admin/coordinator-stats').then((r) => r.data);

export const getBarrioStats = (): Promise<BarrioStat[]> =>
    axiosClient.get<BarrioStat[]>('/admin/barrio-stats').then((r) => r.data);

export const getConsultasStats = (): Promise<ConsultasStats> =>
    axiosClient.get<ConsultasStats>('/estadisticas/consultas').then((r) => r.data);
