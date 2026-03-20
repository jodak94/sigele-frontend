import axiosClient from './axiosClient';
import type { ElectorResult } from '../types/padron';

export const getElector = (numeroCed: string): Promise<ElectorResult[]> =>
    axiosClient.get<ElectorResult[]>(`/electores/${numeroCed}`).then((r) => r.data);
