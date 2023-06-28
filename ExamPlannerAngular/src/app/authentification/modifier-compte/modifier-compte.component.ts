import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { Compte } from 'src/app/models/compte';
import { Admin, DirecteurStage, Enseignant, Personne } from 'src/app/models/personne';
declare let $: any;
import { CompteService } from 'src/app/services/compte.service';
import { PersonneService } from 'src/app/services/personne.service';
import { SendingMailService } from 'src/app/services/sending-mail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modifier-compte',
  templateUrl: './modifier-compte.component.html',
  styleUrls: ['./modifier-compte.component.css']
})
export class ModifierCompteComponent implements OnInit {

  editForm!: FormGroup; mdpForm!: FormGroup;

  public updatePersonne!: Personne;
  submitted = false; submittedMdp = false;
  public user !: Personne | Enseignant | DirecteurStage | Admin;
  public role: any;
  public personnes!: Personne[];

  userFile: any = null;
  imageUrl: any;
  public imagePath: any;
  public userImageUrl:any;


  constructor(private sendingMailService:SendingMailService,private formBuilder: FormBuilder, private route: ActivatedRoute,
    private compteService: CompteService, public personneService: PersonneService, private router: Router) {
    this.mdpForm = this.formBuilder.group({
      mdpOld: new FormControl('', Validators.required),
      mdp: new FormControl('', Validators.required),
      mdpConfirm: new FormControl('', Validators.required)

    },
      {
        validators: this.mustMatch('mdp', 'mdpConfirm')
      }

    );

  }

  ngOnInit(): void {


    const userID = +this.route.snapshot.params['id'];
    this.initForm();
    this.initMdpForm();
    this.personneService.getPersonneRoleById(userID).subscribe(
      (response: any) => {
        this.role = response; console.log("helloo" + this.role);




      });


    this.personneService.getPersonneById(userID).subscribe(
      response => {
        this.user = response;
        console.log("this" + this.user);


        if (this.user.photo!=null)

this.userImageUrl=this.personneService.host+'/personnes/userPhoto/'+this.user?.id_pers;
else this.userImageUrl="https://guidedesfax.tn/wp-content/uploads/2019/11/placeholder.png"


        this.editForm.controls["nom_pers"].setValue(this.user.nom_pers);
        this.editForm.controls["prenom_pers"].setValue(this.user.prenom_pers);
        this.editForm.controls["email"].setValue(this.user.email);
        this.editForm.controls["date_naiss"].setValue(formatDate(this.user.date_naiss, 'yyyy-MM-dd', 'fr'));
        this.editForm.controls["login"].setValue(this.user.idCompte.login);
        

      }

      , (error: HttpErrorResponse) => { alert(error.message); }

    )





  }


  get editF() { return this.editForm.controls; }


  initForm() {

    this.editForm = this.formBuilder.group(
      {
        nom_pers: ['', [Validators.required]],
        prenom_pers: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        date_naiss: ['', [Validators.required]],
        login: ['', [Validators.required]],




      }
    );


  }



  onUpdateCompte() {

    console.log(this.userFile);


    console.log(this.user.id_pers);
    console.log(this.editForm.value);



    this.personneService.getPersonneRoleById(this.user.id_pers).subscribe(
      (response: any) => { this.role = response; console.log("helloo" + this.role); },
      (error: HttpErrorResponse) => { alert(error.message); }

    );


    this.submitted = true;

    if (this.editForm.invalid) { return; }

    if (this.submitted) {

      this.personneService.getPersonneRoleById(this.user.id_pers).subscribe(
        (response: any) => {
          this.role = response; console.log("helloo" + this.role);


          let editPersonne: any = this.user;
          let editCompte: any = this.user.idCompte;
          editPersonne.nom_pers = this.editForm.value.nom_pers;
          editPersonne.prenom_pers = this.editForm.value.prenom_pers;
          editPersonne.email = this.editForm.value.email;
          editPersonne.date_naiss = this.editForm.value.date_naiss;
          if (this.userFile != null)
            editPersonne.photo = this.userFile.name;

          editCompte.login = this.editForm.value.login;
          console.log(editPersonne)

          this.compteService.updateCompte(editCompte).subscribe(
            response => {
              console.log("success" + editCompte);
            },
            (error: HttpErrorResponse) => { alert(error.message); }
          );




          if (this.role == 'ens') {
            this.personneService.updateEnseignant(editPersonne).subscribe(
              response => {
                if (this.userFile != null) {
                  console.log(this.userFile);
                  this.personneService.uploadImage(this.userFile).subscribe(
                    response => { console.log("true") },
                    (error: HttpErrorResponse) => { alert(error.message); }
                  );
                }


                Swal.fire({
                  title: 'Succés!!',
                  text: "compte modifié avec succés",
                  icon: 'success'
                });
              },
              (error: HttpErrorResponse) => { alert(error.message); }
            );




          }
          else if (this.role == "ds") {
            this.personneService.updateDs(editPersonne).subscribe(
              response => {
                if (this.userFile != null) {
                  console.log(this.userFile);
                  this.personneService.uploadImage(this.userFile).subscribe(
                    response => { console.log("true") },
                    (error: HttpErrorResponse) => { alert(error.message); }
                  );
                }
                console.log(editPersonne);
                Swal.fire({
                  title: 'Succés!!',
                  text: "compte modifié avec succés",
                  icon: 'success'
                });
              },
              (error: HttpErrorResponse) => { alert(error.message); }
            );

          }
          else if (this.role == 'admin') {
            if (this.userFile != null) {
              console.log(this.userFile);
              this.personneService.uploadImage(this.userFile).subscribe(
                response => { console.log("true") },
                (error: HttpErrorResponse) => { alert(error.message); }
              );
            }
            this.personneService.updateAdmin(editPersonne).subscribe(
              response => {
                console.log(editPersonne);
                Swal.fire({
                  title: 'Succés!!',
                  text: "compte modifié avec succés",
                  icon: 'success'
                });
              },
              (error: HttpErrorResponse) => { alert(error.message); }
            );

          }

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      );
    }

  }

  onSelectFile(event: any) {
    console.log(event.target.files.length);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.userFile = file;


      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      var reader = new FileReader();

      this.imagePath = file;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imageUrl = reader.result;

      }


    }


  }

  // modal modifier mot de passe //

  editMdp() {
    $("#editMdp").modal("show");
  }


  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");
    this.mdpForm.reset();


  }
  get mdpF() { return this.mdpForm.controls; }


  mustMatch(mdp: any, mdpConfirm: any) {
    return (formGroup: FormGroup) => {
      const mdpControl = formGroup.controls[mdp];
      const mdpConfirrmControl = formGroup.controls[mdpConfirm];
      if (mdpConfirrmControl.errors && !mdpConfirrmControl.errors['mustMatch']) {
        return;
      }
      if (mdpControl.value !== mdpConfirrmControl.value) {
        mdpConfirrmControl.setErrors({ mustMatch: true })
      }
      else {
        mdpConfirrmControl.setErrors(null);
      }
    }

  }

  initMdpForm() {



  }
  public onEditMdp() {

    this.submittedMdp = true;
    if (this.submittedMdp) {
      if (this.mdpForm.invalid) { return; }


      if (this.mdpForm.value.mdpOld == this.user.idCompte.mdp) {

        var compte = new Compte();
        compte = this.user.idCompte;

        compte.mdp = this.mdpForm.value.mdp;


        this.compteService.updateCompte(compte).subscribe(
          response => {
            console.log(this.mdpForm);
            Swal.fire({
              title: 'Succés!!',
              text: "mot de passe modifié avec succés",
              icon: 'success'
            });
            this.sendingMailService.confirmationMdp(this.user).subscribe(
              response => {
                console.log(response);
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  text: "Un email vous a éte envoyé a l'adresse "+ this.user.email ,
                  
                  showConfirmButton: false,
                  timer: 2000
                })
  
          
              },
              (error: HttpErrorResponse) => { alert(error.message); }
          
            )
            this.mdpForm.reset();
            $("#editMdp").modal("hide");

          },
          (error: HttpErrorResponse) => { alert(error.message); }
        );



      }
      else {
        Swal.fire({
          title: 'erreur !!',
          text: " Votre ancien mot de passe est incorrecte  ",
          icon: 'error'
        });
        this.mdpForm.reset();

      }






    }
  }

}


