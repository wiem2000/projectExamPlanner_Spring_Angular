import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compte } from '../models/compte';
import { Personne } from '../models/personne';
import { AuthenticationService } from '../services/authentication.service';
import { CompteService } from '../services/compte.service';
import { PersonneService } from '../services/personne.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  
  public personnes!:Personne[];
 
  role!:string;

  constructor(public authenticationService:AuthenticationService, private personneService:PersonneService, private router:Router) { }

  ngOnInit(): void {
   
    this.getPersonnes();
   
    
   

  }


  public getRoleUser(){
  if(this.personnes)
    this.personneService.getPersonneRoleById(this.authenticationService.getUserLoggedIn(this.personnes).id_pers).subscribe(
      (response:any) => {  this.role=response;console.log("helloo"+this.role); },
      (error: HttpErrorResponse) => { alert(error.message); }

             );
        
          
  
}
 
  public getPersonnes(): void {

    this.personneService.getPersonnes().subscribe(
      response => {
        this.personnes = response;
       

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  onLogout(){

    this.authenticationService.logOut();
    this.router.navigate(['']);
  }
  onCompte(user: any) {

    this.router.navigateByUrl(`compte/${user.id_pers}`);


  }


}
