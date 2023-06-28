import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonneService } from 'src/app/services/personne.service';
import { Compte } from 'src/app/models/compte';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Admin, DirecteurStage, Enseignant, Personne } from 'src/app/models/personne';
import { Observable } from 'rxjs';
import { CompteService } from 'src/app/services/compte.service';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { SendingMailService } from 'src/app/services/sending-mail.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  enseignants!:Enseignant[];
  directeurStages!:DirecteurStage[];
  admins!:Admin[];
  loginForm!: FormGroup;
  submitted = false;
  personnes!: Personne[];
  comptes!: Compte[];

  constructor(private personneService: PersonneService, private compteService: CompteService, private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.getComptes();
    this.getPersonnes();
  

  }

  get loginF() { return this.loginForm.controls; }

  public getComptes(): void {

    this.compteService.getComptes().subscribe(
      response => {this.comptes = response; },
      (error: HttpErrorResponse) => { alert(error.message); }

    )
  }
  public getPersonnes(): void {

    this.personneService.getPersonnes().subscribe(
      response => { this.personnes = response; console.log(this.personnes);},
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
 
 
 



  initForm() {
    this.loginForm = this.formBuilder.group(
      {
        login: ['', [Validators.required]],
        mdp: ['', [Validators.required]],

      }
    );
  }



  onLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) { return; }
    if (!this.authenticationService.isUserLoggedIn()) {
      if (this.submitted) {

        var c = new Compte();

        c.login = this.loginForm.value.login;
        c.mdp = this.loginForm.value.mdp;
        if (this.authenticationService.existCompte(this.comptes, c) != null) {
          console.log(this.authenticationService.existCompte(this.comptes, c));
          let p = this.authenticationService.getPersonneByCompte(this.personnes, this.authenticationService.existCompte(this.comptes, c));
          console.log(p);
          

          /*
  
            this.personneService.getPersonneRoleById(p.id_pers).subscribe(
              (response:any) => { console.log("role "+response); 
              if(response=='admin') this.router.navigate([`/`]);
              if(response=='ds') this.router.navigate([`/`]);
              if(response=='ens') this.router.navigate([`/`]);
            
             
            },
              (error: HttpErrorResponse) => { alert(error.message); }
        
                     );
              
            */      
          
          
          sessionStorage.setItem('email', p.email);
          this.router.navigateByUrl("/dashboard")
      
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            text: " Bienvenu "+ p.prenom_pers ,
            
            showConfirmButton: false,
            timer: 2000
          })

          
          
        }
        else {
          Swal.fire({
            title: 'Utilisateur introuvable !!',
            text: "Veuillez verifier vos informations de connexion",
            icon: 'error'
          });

        }
      }
    }
    else {
      Swal.fire({
        title: 'Vous etes deja connecté !!',
        text: "Veuillez vous déconnecter ",
        icon: 'error'
      });


    }

  }

}
