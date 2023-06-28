import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Compte } from '../models/compte';
import { Admin, DirecteurStage, Enseignant, Personne } from '../models/personne';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  public host:string="http://localhost:8080";
  private stringUrl!: string;
  constructor(private http: HttpClient) { this.stringUrl = environment.apiBaseUrl + "/personnes"; }

  //_______________upload image ________________________________________

  public uploadImage(file:any): Observable<void>{
    const formdata: FormData = new FormData();
		formdata.append('file', file);
    console.log("servive"+file);
    return this.http.post<void>(this.stringUrl+'/uploadImage',formdata);
  }

  //_________________personne________________________________________

  public getPersonnes(): Observable<Personne[]> {
    return this.http.get<Personne[]>(this.stringUrl + '/all');

  }


  public getPersonneById(id:any):Observable<Personne|Enseignant|DirecteurStage|Admin>{
    return this.http.get<Personne|Enseignant|DirecteurStage|Admin>(this.stringUrl+'/find/'+id);
  
  }
  public getPersonneByEmail(email:String|null,personnes:Personne[]):Personne{
    if(email!=null)
    {for(var p of personnes)
      {
        if(p.email==email)
        { 
          return p;
        }
      }
    }
      return null as any;
  
    }
    public deletePersonne(pers_Id : number): Observable<void>{
      return this.http.delete<void>(this.stringUrl+'/delete/'+pers_Id);
    }

    public existsPersonne(list:Personne[],p:Personne):boolean{
      let trouve:boolean=false; let i=0;
     while(i<list.length && trouve==false){
       if(list[i].email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()==p.email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
       {
         trouve=true;
       }
       else i++;
     }
     return trouve;
    
    }

  //___________________enseignant______________________________________

  public getEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>( environment.apiBaseUrl+ '/enseignants/all');
  
  }

  public getEnseignantById(id:any):Observable<Enseignant>{
    return this.http.get<Enseignant>(environment.apiBaseUrl + "/enseignants/find/"+id);
  
  }
  public updateEnseignant(enseignant: Enseignant): Observable<Enseignant>{
    return this.http.put<Enseignant>(environment.apiBaseUrl+'/enseignants/update',enseignant);
  }
  public addEnseignant(enseignant: Enseignant){
    return this.http.post(environment.apiBaseUrl+'/enseignants/add',enseignant);
  }
  //__________________directeur de stage_______________________________________________


  public getDirecteurStages(): Observable<DirecteurStage[]> {
    return this.http.get<DirecteurStage[]>( environment.apiBaseUrl+ '/directeurStages/all');

  }
  public getDirecteurStageById(id:any):Observable<DirecteurStage>{
    return this.http.get<DirecteurStage>(environment.apiBaseUrl+'/directeurStages/find/'+id);
  
  }
  public updateDs(ds: DirecteurStage): Observable<DirecteurStage>{
    return this.http.put<DirecteurStage>(environment.apiBaseUrl+'/directeurStages/update',ds);
  }
  public addDs(ds: DirecteurStage){
    return this.http.post(environment.apiBaseUrl+'/directeurStages/add',ds);
  }
 
  //________________________admin______________________________________________

  public getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>( environment.apiBaseUrl+ '/admins/all');

  }
  public getAdminById(id:any):Observable<Admin>{
    return this.http.get<Admin>(environment.apiBaseUrl+"/admins/find/"+id);
  
  }

  public updateAdmin(admin: Admin): Observable<Admin>{
    return this.http.put<Admin>(environment.apiBaseUrl+'/admins/update',admin);
  }
  public addAdmin(admin: Admin){
    return this.http.post(environment.apiBaseUrl+'/admins/add',admin);
  }


//____________________Role personne_________________________________________


  public getPersonneRoleById(id:any):any{
    return this.http.get(this.stringUrl+'/role/'+id, {responseType: 'text'});
  
  }

  










   


}
