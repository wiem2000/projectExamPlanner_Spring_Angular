import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contrainte } from '../models/contrainte';
import { Matiere } from '../models/matiere';

@Injectable({
  providedIn: 'root'
})
export class ContrainteService {

  private stringUrl!:string;
  constructor(private http:HttpClient) {this.stringUrl=environment.apiBaseUrl+"/contraintes" }
  
  public getContraintes():Observable<Contrainte[]>{
    return this.http.get<Contrainte[]>(this.stringUrl+'/all');

}
public addContrainte(contrainte:Contrainte){
  return this.http.post(this.stringUrl+"/add",contrainte);
}
public updateContrainte(contrainte : Contrainte): Observable<Contrainte>{
  return this.http.put<Contrainte>(this.stringUrl+'/update',contrainte);
}
public deleteContrainte(id_contrainte : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+id_contrainte);
}

public existContrainte(list:Contrainte[],contrainte:Contrainte):boolean{
  let trouve=false;
  let i=0;
  while(i<list.length && trouve==false){
    if(list[i].matieres.findIndex(x=>x.id_mat==contrainte.matieres[0].id_mat)!=-1 && list[i].matieres.findIndex(x=>x.id_mat==contrainte.matieres[1].id_mat)!=-1 )
    {
      trouve=true;
    } 
    else i++;
  }

  return trouve;
}

public nbContrainte(list:Contrainte[],matiere:Matiere):number{
  let nb=0;
  for(let c of list){
    if(c.matieres.findIndex(x=>x.id_mat==matiere.id_mat)!=-1){
      nb++;
    }
  }
  return nb;
}

}
