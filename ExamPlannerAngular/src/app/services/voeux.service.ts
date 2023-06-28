import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExamenSalle } from '../models/examen-salle';
import { Planification } from '../models/planification';
import { Seance } from '../models/seance';
import { Voeux } from '../models/voeux';

@Injectable({
  providedIn: 'root'
})
export class VoeuxService {

  private stringUrl!:string;
  constructor(private http:HttpClient) {this.stringUrl=environment.apiBaseUrl+"/voeux"; }

  public getVoeux():Observable<Voeux[]>{
    return this.http.get<Voeux[]>(this.stringUrl+'/all');

}

public updateVoeux(voeux : Voeux): Observable<Voeux>{
  return this.http.put<Voeux>(this.stringUrl+'/update',voeux);
}

public addVoeux(voeux:Voeux){
  return this.http.post(this.stringUrl+"/add",voeux);
}
public deleteVoeux(voeux_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+voeux_Id);
}
public getVoeuxByEnseignant(enseignant_Id : number):Observable<Voeux[]>{
  return this.http.get<Voeux[]>(this.stringUrl+'/findByEnseignant/'+enseignant_Id);

}

public getVoeuxByEnseignantByPlanif(liste:Voeux[],planif:Planification){
  let voeux:Voeux[]=[];
  if(liste)
  for(let  i=0;i<liste.length;i++ )
  {if (liste[i].idExamenSalle.idExamen.idPlanification.id_planif==planif.id_planif) voeux.push(liste[i]);}
  return voeux;
}


public getVoeuxByDateSeancePlanif(liste:Voeux[],date:Date,seance:Seance,p:Planification){
  let voeux:Voeux[]=[];
  if(liste)
  for(let  i=0;i<liste.length;i++ )
  {if (liste[i].idExamenSalle.idExamen.idPlanification.id_planif==p.id_planif && liste[i].idExamenSalle.idExamen.idSeance.num_seance==seance.num_seance &&  new Date(liste[i].idExamenSalle.idExamen.date_exam).toLocaleDateString()===new Date(date).toLocaleDateString() ) 
    
    voeux.push(liste[i]);}
  return voeux;
}

public getVoeuxByExamSalle(liste:Voeux[],examSalle:ExamenSalle){
  let voeux:Voeux[]=[];
  if(liste)
  for(let  i=0;i<liste.length;i++ )
  {if (liste[i].idExamenSalle.id==examSalle.id ) 
    
    voeux.push(liste[i]);}
  return voeux;
}

public getVoeuxByPlanif(id:number):Observable<Voeux[]>{
  return this.http.get<Voeux[]>(this.stringUrl+"/findByPlanif/"+id);
}




}
