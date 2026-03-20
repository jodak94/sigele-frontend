import axios from 'axios';
import type { ElectorResult } from '../types/padron';

const publicClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const getElector = (numeroCed: string): Promise<ElectorResult[]> =>
    publicClient.get<ElectorResult[]>(`/electores/${numeroCed}`).then((r) => r.data);
