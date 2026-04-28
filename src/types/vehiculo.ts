export interface Vehiculo {
    id: number;
    capacidad: number;
    nombreDueno: string;
    telefonoDueno: string;
    operadorId: number | null;
    operadorNombre: string | null;
    montoAlquiler: number;
    observacion: string | null;
}

export interface CreateVehiculoRequest {
    capacidad: number;
    nombreDueno: string;
    telefonoDueno: string;
    operadorId?: number;
    montoAlquiler: number;
    observacion?: string;
}

export interface UpdateVehiculoRequest {
    capacidad: number;
    nombreDueno: string;
    telefonoDueno: string;
    operadorId?: number;
    montoAlquiler: number;
    observacion?: string;
}

export interface VehiculoRequest {
    id: number;
    electorId: number;
    operadorId: number;
    operadorNombre: string;
    nombreDueno: string;
    telefonoDueno: string;
    capacidad: number;
    montoAlquiler: number | null;
    estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
    observacion: string | null;
    aprobadoPorNombre: string | null;
    fechaResolucion: string | null;
    creadoEn: string;
}

export interface ResolveVehiculoRequestData {
    observacion?: string;
    montoAlquiler?: number;
}

export interface VehiculoReporteItem {
    nombreDueno: string;
    telefonoDueno: string;
    capacidad: number;
    montoAlquiler: number;
    operadorNombre: string | null;
    observacion: string | null;
}

export interface VehiculosReporteData {
    vehiculos: VehiculoReporteItem[];
    total: number;
}
