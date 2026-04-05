import { create } from 'zustand';
import { getTenantPlan } from '../api/planApi';
import type { TenantPlan } from '../types/plan';

interface PlanState {
    plan: TenantPlan | null;
    refreshPlan: () => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
    plan: null,
    refreshPlan: async () => {
        try {
            const plan = await getTenantPlan();
            set({ plan });
        } catch {
            // fail silently — no interrumpir el flujo si el endpoint falla
        }
    },
}));
