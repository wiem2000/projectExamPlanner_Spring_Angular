import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Personne } from 'src/app/models/personne';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PersonneService } from 'src/app/services/personne.service';
import { SendingMailService } from 'src/app/services/sending-mail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mdp-oublie',
  templateUrl: './mdp-oublie.component.html',
  styleUrls: ['./mdp-oublie.component.css']
})
export class MdpOublieComponent implements OnInit {

  personnes!:Personne[];
 
  mdpForm!: FormGroup;
  submitted = false;
 
 
   constructor(private sendingMailService:SendingMailService, private personneService:PersonneService,private authenticationService:AuthenticationService,
     private formBuilder: FormBuilder, private router: Router ) { }
 
   ngOnInit(): void {
     this.initForm();
     this.getPersonnes();
    
   }
 
   get mdpF() { return this.mdpForm.controls; }
   initForm() {
     this.mdpForm = this.formBuilder.group(
       {
         email: ['', [Validators.required,Validators.email]],
        
 
       }
     );
   }
 
   public getPersonnes(): void {
 
     this.personneService.getPersonnes().subscribe(
       response => {
         this.personnes= response;
         console.log(this.personnes);
 
       },
       (error: HttpErrorResponse) => { alert(error.message); }
 
     )
 
   }
 
 
   public onSubmit(){
     this.submitted = true;
     if (this.mdpForm.invalid) { return; }
     if (!this.authenticationService.isUserLoggedIn()) {
       if (this.submitted) {
 
         let p:Personne = this.personneService.getPersonneByEmail(this.mdpForm.value.email,this.personnes);
 
         if (p != null) {
           console.log(p);
           if(p.idCompte.active==true)
           {this.sendingMailService.recupererCompte(p).subscribe(
             response => {
               console.log(response);
               Swal.fire({
                 position: 'top-end',
                 icon: 'success',
                 text: "Un email vous a éte envoyé a l'adresse "+ p.email ,
                 
                 showConfirmButton: false,
                 timer: 2000
               })
 
         
             },
             (error: HttpErrorResponse) => { alert(error.message); }
         
           )
            }
            else{
              Swal.fire({
                title: "Votre compte n'est pas activé !!",
                text: "Veuillez activer votre compte pour vous connecter ",
                icon: 'error'
              });

            }
         
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
