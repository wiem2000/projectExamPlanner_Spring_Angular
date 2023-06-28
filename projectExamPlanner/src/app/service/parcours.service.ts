import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parcours } from '../models/parcours';

@Injectable({
  providedIn: 'root'
})
export class ParcoursService {
  private apiServerUrl = environment.apiBaseUrl ;


  constructor(private http:HttpClient) { }


  public getParcours(){
    return this.http.get(this.apiServerUrl+'/parcours/all');
}
}
