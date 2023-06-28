import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Personne } from '../models/personne';

@Injectable({
  providedIn: 'root'
})
export class SendingMailService {
  private stringUrl!:string;

  constructor( private http:HttpClient) { this.stringUrl="http://localhost:8080/mail"; }

  public send(personne:Personne): Observable<Boolean>{
    return this.http.post<Boolean>(this.stringUrl+'/activerCompte',personne);
  }
  public recupererCompte(personne:Personne): Observable<Boolean>{
    return this.http.post<Boolean>(this.stringUrl+'/recupererCompte',personne);
  }
  public confirmationMdp(personne:Personne): Observable<Boolean>{
    return this.http.post<Boolean>(this.stringUrl+'/confirmationMdp',personne);
  }
}
