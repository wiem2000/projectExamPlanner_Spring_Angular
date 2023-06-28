import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Examen } from '../models/examen';
import { ExamenSalle } from '../models/examen-salle';
import { Planification } from '../models/planification';
import { Seance } from '../models/seance';

@Injectable({
  providedIn: 'root'
})
export class ExamenSalleService {

  private stringUrl!:string;

  constructor( private http:HttpClient) { this.stringUrl="http://localhost:8080/examens_salles"; }

  public getAllExamenSalles():Observable<ExamenSalle[]>{
    return this.http.get<ExamenSalle[]>(this.stringUrl+"/all");
  }
 
  public getAllExamenSallesByExamen(liste:ExamenSalle[],examen:Examen){
    let examens_salles:ExamenSalle[]=[];
    
    for(let i=0;i<liste.length;i++){
      if (liste[i].idExamen?.id_exam==examen?.id_exam)
      {
        examens_salles.push(liste[i]);
      }
    }
    return examens_salles;
   
  }
  public getExamenSallesByDateSeancePlanif(liste:ExamenSalle[],date:Date,seance:Seance,p:Planification){
    let examens_salles:ExamenSalle[]=[];
    if(liste)
    for(let i=0;i<liste.length;i++){
      if (liste[i].idExamen.idPlanification.id_planif==p.id_planif && liste[i].idExamen.idSeance.num_seance==seance.num_seance &&  new Date(liste[i].idExamen.date_exam).toLocaleDateString()===new Date(date).toLocaleDateString() )
      {
        examens_salles.push(liste[i]);
      }
    }
    return examens_salles;
   
  }
  public getExamenSallesByPlanif(id:number):Observable<ExamenSalle[]>{
    return this.http.get<ExamenSalle[]>(this.stringUrl+"/findByPlanif/"+id);
  }

  

}
