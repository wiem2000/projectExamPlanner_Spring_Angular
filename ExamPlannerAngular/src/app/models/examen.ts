import { Matiere } from "./matiere";
import { Planification } from "./planification";
import { Seance } from "./seance";

export class Examen {
    id_exam!:number;
	nom_exam!:string;
	type_exam!:string;
	nb_heure!:number;
	nb_etud!:number;
	date_exam!:Date;
	idMatiere!: Matiere ;
	idSeance!: Seance ;
	idPlanification!:Planification;
}
