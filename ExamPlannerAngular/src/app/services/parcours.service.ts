import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parcours } from '../models/parcours';

@Injectable({
  providedIn: 'root'
})
export class ParcoursService {

  private stringUrl!:string;
  constructor(private http:HttpClient) {this.stringUrl=environment.apiBaseUrl+"/parcours"; }

  public getParcours():Observable<Parcours[]>{
    return this.http.get<Parcours[]>(this.stringUrl+'/all');

}
public getParcoursActive():Observable<Parcours[]>{
  return this.http.get<Parcours[]>(this.stringUrl+'/findAllActive');

}
public updateParcours(parcours : Parcours): Observable<Parcours>{
  return this.http.put<Parcours>(this.stringUrl+'/update',parcours);
}

public addParcours(parcours:Parcours){
  return this.http.post(this.stringUrl+"/add",parcours);
}
public deleteParcours(parcours_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+parcours_Id);
}
public existeParcours(list:Parcours[],parcours:Parcours):boolean
{
let trouve=false;
let i=0;
while(i<list.length && trouve==false){
  if(list[i].nom_par.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()==parcours.nom_par.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
  trouve=true;
  else i++;
}
return trouve;
}
}
