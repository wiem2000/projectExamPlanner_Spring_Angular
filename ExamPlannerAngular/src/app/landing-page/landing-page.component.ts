import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Enseignant, Personne } from '../models/personne';
import { AuthenticationService } from '../services/authentication.service';
import { PersonneService } from '../services/personne.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  date!:Date;
  titre='Plateforme adaptative de Planification automatique des examens universitaire et des voeux de surveillance';
  public personnes!:Personne[];
  role!:string;
  
  
  constructor(private router:Router,public authenticationService: AuthenticationService,private personneService:PersonneService) {
    setInterval(() => {
      this.date = new Date()
    }, 0)
   }

  ngOnInit(): void {
    
    
    
    
    console.log("utilisateur connecté ? "+this.authenticationService.isUserLoggedIn());
    this.getPersonnes();
   


  }
  public getRoleUser(){
    
    if(this.personnes && this.authenticationService.getUserLoggedIn(this.personnes) )
      this.personneService.getPersonneRoleById(this.authenticationService.getUserLoggedIn(this.personnes).id_pers).subscribe(
        (response:any) => {  this.role=response;console.log("helloo"+this.role); },
        (error: HttpErrorResponse) => { alert(error.message); }
  
               );
          
            
    
  }

  public getPersonnes(): void {
    
    this.personneService.getPersonnes().subscribe(
      response => {
        this.personnes = response;
        if(this.authenticationService.isUserLoggedIn()==true)
        this.getRoleUser();
       

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  



}
