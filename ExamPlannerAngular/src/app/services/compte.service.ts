import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Compte } from '../models/compte';
import { Personne } from '../models/personne';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  

  private stringUrl!:string;
  constructor(private http:HttpClient) {this.stringUrl=environment.apiBaseUrl+"/comptes" }
  
  public getComptes():Observable<Compte[]>{
    return this.http.get<Compte[]>(this.stringUrl+'/all');

}
public updateCompte(compte : Compte): Observable<Compte>{
  return this.http.put<Compte>(this.stringUrl+'/update',compte);
}
public getCompteByIdPersonne(id:any):Observable<Compte>{
  return this.http.get<Compte>(environment.apiBaseUrl+'/personnes/'+id+'/idCompte');

}
public existsCompte(list:Compte[],c:Compte):boolean{
  let trouve:boolean=false; let i=0;
  
  
 while(i<list.length && trouve==false){
   if(list[i].login==c.login && list[i].mdp==c.mdp)
   { console.log("true")
     trouve=true;
   }
   else i++;
 }
 return trouve;

}





  
}



