export interface Aspirante {
    id?: string;
    nombre: string;
    correo: string;
    nivel?: number;
    puntajePrueba1?: number;
    puntajePrueba2?: number;
    codigoVerificacion?: string;
    evaluacionId?: string
}