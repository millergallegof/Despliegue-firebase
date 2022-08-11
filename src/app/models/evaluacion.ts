import { Pregunta } from "./pregunta";

export interface Evaluacion {
    id?: string;
    preguntaList1: Pregunta[];
    preguntaList2: Pregunta[]
}