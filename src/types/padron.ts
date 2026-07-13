export interface ElectorResult {
    id: number;
    numeroCed: number;
    nombre: string;
    apellido: string;
    direccion: string | null;
    fechaNaci: string;
    mesa: number | null;
    orden: number | null;
    codigoSex: number;
    local: {
        codigoLocal: number;
        nombreLoc: string;
        direccion: string | null;
    };
    zona: {
        depart: number | null;
        distrito: number | null;
        zona: number | null;
        nombreDepart: string | null;
        nombreDistrito: string | null;
        nombreZona: string | null;
    };
}
