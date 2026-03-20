export interface CaptacionRecord {
    id: number;
    operadorId: number;
    cedula: string;
    electorNombre: string;
    electorApellido: string;
    localNombre: string;
    seccional: string;
    mesa: string;
    orden: string;
    telefono: string;
    direccionRecogida: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
    borrado: boolean;
    fechaRegistro: string;
}

export interface CreateCaptacionRequest {
    cedula: string;
    telefono: string;
    direccionRecogida?: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
}

export interface UpdateCaptacionRequest {
    telefono: string;
    direccionRecogida?: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
}
