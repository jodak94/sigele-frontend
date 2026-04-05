export interface PlanPaquete {
    packageType: string;
    label: string;
    electoresAgregados: number;
    precio: number;
    purchasedAt: string;
}

export interface TenantPlan {
    electorCount: number;
    electorLimit: number;
    esPlanFull: boolean;
    enGracia: boolean;
    captacionBloqueada: boolean;
    porcentajeUso: number;
    accessExpiresAt: string | null;
    accesoVencido: boolean;
    paquetes: PlanPaquete[];
}
