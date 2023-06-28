import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Examen } from '../models/examen';
import { Niveau } from '../models/niveau';
import { Seance } from '../models/seance';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private stringUrl!:string;

  constructor( private http:HttpClient) { this.stringUrl="http://localhost:8080/examens"; }

  public getAllExamen():Observable<Examen[]>{
    return this.http.get<Examen[]>(this.stringUrl+"/all");
  }
  public getAllExamenActive(semestre : number):Observable<Examen[]>{
    return this.http.get<Examen[]>(this.stringUrl+"/allActive/"+semestre);
  }
  public getAllExamenByPlanification(id_planif : number):Observable<Examen[]>{
    return this.http.get<Examen[]>(this.stringUrl+"/findByPlanification/"+id_planif);
  }
  // remplacer par get all examen par planification 
  
  public addExamen(examen:Examen){
    return this.http.post(this.stringUrl+"/add",examen);
  }
  public updateExamen(examen : Examen): Observable<Examen>{
    return this.http.put<Examen>(this.stringUrl+'/update',examen);
  }
  public deleteExamen(exam_Id : number): Observable<void>{
    return this.http.delete<void>(this.stringUrl+'/delete/'+exam_Id);
  }
  public getExamenById(id:any):Observable<Examen>{
    return this.http.get<Examen>(this.stringUrl+'/find/'+id);
  
  }

  public getExamenByJourSeance(liste:Examen[],n:Niveau,jour:Date,s:Seance):Examen {
    for(var e of liste)
    {
      if( new Date(e.date_exam).toLocaleDateString()===new Date(jour).toLocaleDateString()&& e.idSeance.num_seance==s.num_seance && e.idMatiere.idModule.idNiveau.id_niv==n.id_niv)
      return e;
    }
    return null as any;
    
   
  }
  public getNbEtudiantByJourSeance(liste:Examen[],jour:Date,s:Seance):number {
    let nb=0;
    for(var e of liste)
    {
      if( new Date(e.date_exam).toLocaleDateString()===new Date(jour).toLocaleDateString() && e.idSeance.num_seance==s.num_seance)
      nb=nb+e.nb_etud;
 
    }
    return nb;

  }

  public getExamenByNiveau(liste:Examen[],n:Niveau):Examen[] {
    let examens:Examen[]=[]
    for(var e of liste)
    {
      if(e.idMatiere.idModule.idNiveau.id_niv==n.id_niv)
      examens.push(e);
    }
    return examens;
    
   
  }
}
