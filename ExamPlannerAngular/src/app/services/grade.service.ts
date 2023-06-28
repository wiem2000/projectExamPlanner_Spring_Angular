import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Grade } from '../models/grade';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private stringUrl!:string;
  

  constructor(private http:HttpClient) { this.stringUrl=environment.apiBaseUrl+"/grades";}
  
  public getAllGrades():Observable<Grade[]>{
    return this.http.get<Grade[]>(this.stringUrl+'/all');

}
public updateGrade(grade : Grade): Observable<Grade>{
  return this.http.put<Grade>(this.stringUrl+'/update',grade);
}

public addGrade(grade:Grade){
  return this.http.post(this.stringUrl+"/add",grade);
}
public deleteGrade(grade_Id : number): Observable<void>{
  return this.http.delete<void>(this.stringUrl+'/delete/'+grade_Id);
}
public existeGrade(list:Grade[],grade:Grade):boolean
{
let trouve=false;
let i=0;
while(i<list.length && trouve==false){
  if(list[i].nom_grade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()==grade.nom_grade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
  trouve=true;
  else i++;
}
return trouve;
}
}
