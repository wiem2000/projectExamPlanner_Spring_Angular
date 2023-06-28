import { Compte } from "./compte";
import { Grade } from "./grade";

export class Personne {

    id_pers!:number;
   
	nom_pers!:string;
	prenom_pers!:string;
	email!:string;
    date_naiss!:Date;
    photo!:string;
    idCompte!:Compte;
    

}
export class Enseignant extends Personne{
    
    convocation!:String;
	due_surv!:number;
    idGrade!:Grade
}
export class Admin extends Personne{
    
   
}
export class DirecteurStage extends Personne{
    
   
}