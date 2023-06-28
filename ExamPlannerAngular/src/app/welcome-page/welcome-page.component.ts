import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Personne } from '../models/personne';
import { AuthenticationService } from '../services/authentication.service';
import { PersonneService } from '../services/personne.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  
  public personnes!:Personne[];
  role!:string;
  constructor(public authenticationService: AuthenticationService,private personneService:PersonneService) { }

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
