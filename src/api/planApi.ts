import axiosClient from './axiosClient';
import type { TenantPlan } from '../types/plan';

export const getTenantPlan = async (): Promise<TenantPlan> =>
    axiosClient.get<TenantPlan>('/tenant/plan').then((r) => r.data);
