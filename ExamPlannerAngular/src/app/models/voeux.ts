import { ExamenSalle } from "./examen-salle";
import { Enseignant } from "./personne";

import { Seance } from "./seance";

export class Voeux {
    
    id_voeux!: number;
    idExamenSalle!:ExamenSalle;
    idEnseignant!: Enseignant;
    
}

export class VoeuxNonValide{
    jour!:Date;
    idSeance!: Seance;
}