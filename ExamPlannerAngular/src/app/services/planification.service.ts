import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planification } from '../models/planification';

@Injectable({
  providedIn: 'root'
})
export class PlanificationService {

  private apiServerUrl = environment.apiBaseUrl ;

  constructor(private http:HttpClient) { }

  public getPlanificatins():Observable<Planification[]>{
    return this.http.get<Planification[]>(this.apiServerUrl+'/planifications/all');

}
public getPlanificationById(id:any):Observable<Planification>{
  return this.http.get<Planification>(this.apiServerUrl+'/planifications/'+id);

}

public addPlanification(planification:Planification): Observable<Planification>
{
  return this.http.post<Planification>(this.apiServerUrl+'/planifications/add',planification);
}

public updatePlanification(planification : Planification): Observable<Planification>{
  return this.http.put<Planification>(this.apiServerUrl+'/planifications/update',planification);
}

public deletePlanification(planif_Id : number): Observable<void>{
  return this.http.delete<void>(this.apiServerUrl+'/planifications/delete/'+planif_Id);
}

public lancerPlanification(planification:Planification): Observable<void>{
  return this.http.put<void>(this.apiServerUrl+'/planifications/planifier',planification);
}
public affecterVoeux(planification:Planification): Observable<void>{
  return this.http.put<void>(this.apiServerUrl+'/planifications/affecterVoeux',planification);
}

public existsPlanif(list:Planification[],planif:Planification):boolean{
  let trouve:boolean=false; let i=0;
 while(i<list.length && trouve==false){
   if(list[i].type_session==planif.type_session && list[i].semestre==planif.semestre && new Date(list[i].date_debut).getFullYear()==new Date(planif.date_debut).getFullYear())
   {
     trouve=true;
   }
   else i++;
 }
 return trouve;

}
public getPlanificationValide(list:Planification[]):Planification[]{
  let listValide:Planification[]=[];
  for(let planif of list){
    if(planif.valide==true){
      listValide.push(planif);
    }

  }
  return listValide;

}

}
