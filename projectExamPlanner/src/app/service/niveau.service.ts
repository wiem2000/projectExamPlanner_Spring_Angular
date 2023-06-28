import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NiveauService {
  private apiServerUrl = environment.apiBaseUrl ;

  constructor(private http:HttpClient) { }

  public getNiveaux(){
    return this.http.get(this.apiServerUrl+'/niveaux/all');
}
}
