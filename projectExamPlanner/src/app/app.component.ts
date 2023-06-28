import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Parcours } from './models/parcours';
import { NiveauService } from './service/niveau.service';
import { ParcoursService } from './service/parcours.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  closeResult = '';
  title = 'projectExamPlanner';

public parcours: any;
public niveaux: any;

constructor(private parcoursService:ParcoursService,
  private niveauService:NiveauService
  ) { }

ngOnInit(): void {
  this.getParcours();
  this.getNiveaux();
  
  
}

public getParcours():void{
  this.parcoursService.getParcours().subscribe(
    response=>{
      this.parcours=response;
      console.log(this.parcours);

    },
    (error:HttpErrorResponse)=>{
      alert(error.message);
    }

  );

  
}

public getNiveaux():void{
  this.niveauService.getNiveaux().subscribe(
    response=>{
      this.niveaux=response;
      console.log(this.niveaux);

    },
    (error:HttpErrorResponse)=>{
      alert(error.message);
    }

  );

  
}

}

