import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Seance } from '../models/seance';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private stringUrl!:string;
  

  constructor(private http:HttpClient) {  this.stringUrl=environment.apiBaseUrl+"/seances";}

  public getSeances():Observable<Seance[]>{
    return this.http.get<Seance[]>(this.stringUrl+"/all");

}
public updateSeance(seance : Seance): Observable<Seance>{
  return this.http.put<Seance>(this.stringUrl+'/update',seance);
}

public addSeance(seance:Seance){
  
  return this.http.post(this.stringUrl+"/add",seance);
}
public deleteSeance(seance_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+seance_Id);
}
public existeSeance(list:Seance[],seance:Seance):boolean
{
let trouve=false;
let i=0;
while(i<list.length && trouve==false){
  if(list[i].heure_debut==seance.heure_debut && list[i].heure_fin==seance.heure_fin )
  trouve=true;
  else i++;
}
return trouve;
}

}
