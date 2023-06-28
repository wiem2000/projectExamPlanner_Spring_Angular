import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Module } from '../models/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private stringUrl!:string;
  

  constructor(private http:HttpClient) { this.stringUrl=environment.apiBaseUrl+"/modules";}
  
  public getAllModules():Observable<Module[]>{
    return this.http.get<Module[]>(this.stringUrl+'/all');

}
public getModulesByNiveau(niveau_Id : number):Observable<Module[]>{
  return this.http.get<Module[]>(this.stringUrl+'/findByNiveau/'+niveau_Id);

}
public updateModule(module : Module): Observable<Module>{
  return this.http.put<Module>(this.stringUrl+'/update',module);
}

public addModule(module:Module){
  return this.http.post(this.stringUrl+"/add",module);
}
public deleteModule(module_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+module_Id);
}
public getModuleById(id:any):Observable<Module>{
  return this.http.get<Module>(this.stringUrl+'/find/'+id);

}

public existeModule(list:Module[],module:Module):boolean
{
let trouve=false;
let i=0;
while(i<list.length && trouve==false){
  if(list[i].nom_mod.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()==module.nom_mod.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  && list[i].idNiveau.id_niv==module.idNiveau.id_niv )
  trouve=true;
  else i++;
}
return trouve;
}


}
