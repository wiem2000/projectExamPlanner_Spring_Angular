import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Module } from '../models/module';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Matiere } from '../models/matiere';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private stringUrl!:string;
  

  constructor(private http:HttpClient) { this.stringUrl=environment.apiBaseUrl+"/matieres";}
  
  public getAllMatieres():Observable<Matiere[]>{
    return this.http.get<Matiere[]>(this.stringUrl+'/all');

}
public updateMatiere(matiere : Matiere): Observable<Matiere>{
  return this.http.put<Matiere>(this.stringUrl+'/update',matiere);
}

public addMatiere(matiere:Matiere){
  return this.http.post(this.stringUrl+"/add",matiere);
}
public deleteMatiere(matiere_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+matiere_Id);
}


public getMatieresByModule(module_Id : number):Observable<Matiere[]>{
  return this.http.get<Matiere[]>(this.stringUrl+'/findByModule/'+module_Id);

}



public existeMatiere(list:Matiere[],matiere:Matiere):boolean
{
let trouve=false;
let i=0;
while(i<list.length && trouve==false){
  if(list[i].nom_mat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()==matiere.nom_mat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  && list[i].idModule.idNiveau.idParcours.id_par==matiere.idModule.idNiveau.idParcours.id_par)
  trouve=true;
  else i++;
}
return trouve;
}

}
