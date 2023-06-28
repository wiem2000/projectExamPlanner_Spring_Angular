import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Salle } from '../models/salle';

@Injectable({
  providedIn: 'root'
})
export class SalleService {

  private stringUrl!:string;
  

  constructor(private http:HttpClient) {  this.stringUrl=environment.apiBaseUrl+"/salles";}

  public getSalles():Observable<Salle[]>{
    return this.http.get<Salle[]>(this.stringUrl+"/all");

}
public updateSalle(salle : Salle): Observable<Salle>{
  return this.http.put<Salle>(this.stringUrl+'/update',salle);
}

public addSalle(salle:Salle){
  return this.http.post(this.stringUrl+"/add",salle);
}
public deleteSalle(salle_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+salle_Id);
}
public getCapaciteTotal(salles:Salle[]): number{
let nb=0;
for(let s of salles){
  nb=nb+s.capacite;
}
return nb;
}
}
