import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Niveau } from '../models/niveau';
import { Parcours } from '../models/parcours';

@Injectable({
  providedIn: 'root'
})
export class NiveauService {

 
  private stringUrl!:string;
  constructor(private http:HttpClient) {this.stringUrl=environment.apiBaseUrl+"/niveaux"; }

  public getNiveaux():Observable<Niveau[]>{
    return this.http.get<Niveau[]>(this.stringUrl+'/all');

}
public getNiveauByParcours(parcours_Id : number):Observable<Niveau[]>{
  return this.http.get<Niveau[]>(this.stringUrl+'/findByParcours/'+parcours_Id);

}
public getNiveauById(id:any):Observable<Niveau>{
  return this.http.get<Niveau>(this.stringUrl+'/find/'+id);

}

public getNiveauxActive():Observable<Niveau[]>{
  return this.http.get<Niveau[]>(this.stringUrl+'/allActive');

}

public updateNiveau(niveau : Niveau): Observable<Niveau>{
  return this.http.put<Niveau>(this.stringUrl+'/update',niveau);
}

public addNiveau(niveau:Niveau){
  return this.http.post(this.stringUrl+"/add",niveau);
}
public deleteNiveau(niveau_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+niveau_Id);
}

public getNiveauByParcours1(p:Parcours,list:Niveau[]):Niveau[]{
  let niveaux:Niveau[]=[];
  if(list)
  for(let  i=0;i<list.length;i++ )
  {if (list[i].idParcours.id_par==p.id_par) niveaux.push(list[i]);}
  return niveaux;


}
public existeNiveau(list:Niveau[],niveau:Niveau):boolean
{
let trouve=false;
let i=0;
while(i<list.length && trouve==false){
  if(list[i].nom_niv.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()==niveau.nom_niv.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
  trouve=true;
  else i++;
}
return trouve;
}


}
