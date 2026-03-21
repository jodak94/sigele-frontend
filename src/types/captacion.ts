export interface CaptacionRecord {
    electorId: number;
    nombre: string;
    apellido: string;
    numeroCed: number;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
    nroTelefono: string;
    direccionRecogida: string;
}

export interface CreateCaptacionRequest {
    electorId: number;
    nroTelefono: string;
    direccionRecogida?: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
}

export interface UpdateCaptacionRequest {
    nroTelefono: string;
    direccionRecogida?: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
}
