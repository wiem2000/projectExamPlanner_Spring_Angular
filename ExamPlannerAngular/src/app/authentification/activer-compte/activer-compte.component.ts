import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Compte } from 'src/app/models/compte';
import { Personne } from 'src/app/models/personne';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompteService } from 'src/app/services/compte.service';
import { PersonneService } from 'src/app/services/personne.service';
import { SendingMailService } from 'src/app/services/sending-mail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activer-compte',
  templateUrl: './activer-compte.component.html',
  styleUrls: ['./activer-compte.component.css']
})
export class ActiverCompteComponent implements OnInit {

  personnes!: Personne[];
  user!: Personne;
  activerForm!: FormGroup;
  submitted = false;


  constructor(private sendingMailService: SendingMailService, private personneService: PersonneService, private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder, private router: Router, private compteService: CompteService) { }

  ngOnInit(): void {
    this.initForm();
    this.getPersonnes();

  }

  get activerF() { return this.activerForm.controls; }
  initForm() {
    this.activerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],


      }
    );
  }

  public getPersonnes(): void {

    this.personneService.getPersonnes().subscribe(
      response => {
        this.personnes = response;
        console.log(this.personnes);

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }



  public onActiver() {
    this.submitted = true;
    if (this.activerForm.invalid) { return; }
    if (!this.authenticationService.isUserLoggedIn()) {
      if (this.submitted) {

        let p: Personne = this.personneService.getPersonneByEmail(this.activerForm.value.email, this.personnes);

        if (p != null) {
          console.log(p);
          if (p.idCompte.active == false) {
            this.sendingMailService.send(p).subscribe(
              response => {
                console.log(response);
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  text: "Un email vous a éte envoyé a l'adresse " + p.email,

                  showConfirmButton: false,
                  timer: 2000
                })


              },
              (error: HttpErrorResponse) => { alert(error.message); }

            )

            let compte = p.idCompte;

            compte.active = true;


            this.compteService.updateCompte(compte).subscribe(
              response => {
                console.log(p.idCompte);
              });



          }
          else {
            Swal.fire({
              title: 'Votre compte est activé !!',
              text: "Veuillez verifier vos informations de connexion . Si vous avez oublié votre mot de passe cliquez sur  'Mot de passe oublié?' ",
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
