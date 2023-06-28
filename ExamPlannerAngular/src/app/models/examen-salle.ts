import { Examen } from "./examen";
import { Salle } from "./salle";

export class ExamenSalle {
    id!:number ; 
    idExamen!:Examen;
  
    idSalle!:Salle;

    nbEtudiant!:number;
}
