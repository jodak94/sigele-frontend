export interface ElectorResult {
    numeroCed: number;
    nombre: string;
    apellido: string;
    direccion: string;
    fechaNaci: string;
    mesa: number;
    orden: number;
    codigoSex: number;
    local: {
        seccLoc: number;
        nombreLoc: string;
        direccion: string | null;
    };
    seccional: {
        nDepart: string;
        nDistrito: string;
        descripcio: string;
        direccion: string;
    };
}
