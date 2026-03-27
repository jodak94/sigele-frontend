import axiosClient from './axiosClient';
import type { AdminKpis, OperatorStats, OperatorInfo, OperatorRanking, VoterSearchResult, ElectorEnListaResult, CoordinatorPerformance, CoordinadorResumen, BarrioStat, SeccionalStat, ConsultasStats, PadronPublicoStats, TopLocalItem, UltimaConsultaItem } from '../types/admin';

export const getAdminKpis = (): Promise<AdminKpis> =>
    axiosClient.get<AdminKpis>('/estadisticas/operadores').then((r) => r.data);

export const getOperatorStats = (): Promise<OperatorStats[]> =>
    axiosClient.get<OperatorStats[]>('/admin/operators').then((r) => r.data);

export const getRankingOperadores = (): Promise<OperatorRanking[]> =>
    axiosClient.get<OperatorRanking[]>('/estadisticas/ranking-operadores').then((r) => r.data);

export const searchVoterByCedula = (cedula: string): Promise<VoterSearchResult> =>
    axiosClient
        .get<VoterSearchResult>('/admin/search', { params: { cedula } })
        .then((r) => r.data);

export const getCoordinatorStats = (): Promise<CoordinatorPerformance[]> =>
    axiosClient.get<CoordinatorPerformance[]>('/admin/coordinator-stats').then((r) => r.data);

export const getResumenCoordinadores = (): Promise<CoordinadorResumen[]> =>
    axiosClient.get<CoordinadorResumen[]>('/estadisticas/resumen-coordinadores').then((r) => r.data);

export const getBarrioStats = (): Promise<BarrioStat[]> =>
    axiosClient.get<BarrioStat[]>('/admin/barrio-stats').then((r) => r.data);

export const getSeccionalStats = (): Promise<SeccionalStat[]> =>
    axiosClient.get<SeccionalStat[]>('/estadisticas/zonales/seccionales').then((r) => r.data);

export const getConsultasStats = (): Promise<ConsultasStats> =>
    axiosClient.get<ConsultasStats>('/estadisticas/consultas').then((r) => r.data);

export const getPadronPublicoStats = (): Promise<PadronPublicoStats> =>
    axiosClient.get<PadronPublicoStats>('/estadisticas/padron-publico').then((r) => r.data);

export const getTopLocales = (top = 5): Promise<TopLocalItem[]> =>
    axiosClient.get<TopLocalItem[]>('/estadisticas/top-locales', { params: { top } }).then((r) => r.data);

export const getUltimasConsultas = (top = 5): Promise<UltimaConsultaItem[]> =>
    axiosClient.get<UltimaConsultaItem[]>('/estadisticas/ultimas-consultas', { params: { top } }).then((r) => r.data);

export const getOperatorInfo = (): Promise<OperatorInfo[]> =>
    axiosClient.get<OperatorInfo[]>('/operadores/info').then((r) => r.data);

export const searchElectorEnListas = (cedula: string): Promise<ElectorEnListaResult[]> =>
    axiosClient.get<ElectorEnListaResult[]>('/operadores/electores/buscar', { params: { cedula } }).then((r) => r.data);
