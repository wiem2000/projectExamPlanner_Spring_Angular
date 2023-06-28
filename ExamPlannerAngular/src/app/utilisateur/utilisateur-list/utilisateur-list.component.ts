import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Compte } from 'src/app/models/compte';
import { Grade } from 'src/app/models/grade';
import { Admin, DirecteurStage, Enseignant, Personne } from 'src/app/models/personne';
import { CompteService } from 'src/app/services/compte.service';
import { GradeService } from 'src/app/services/grade.service';
import { PersonneService } from 'src/app/services/personne.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.css']
})
export class UtilisateurListComponent implements OnInit {

  public utilisateurs!: Personne[];
  addForm!: FormGroup;
  editForm!: FormGroup;
  editCompteForm!: FormGroup;
  public deletePersonne !: Personne;
  selectForm!: FormGroup;

  public updatePersonne !: Personne | Enseignant | DirecteurStage | Admin;
  public role: any;
  public selectRole: any;
  roles: string[] = [];
  grades!: Grade[];


  submitted = false; submittedCompte = false;

  constructor(public personneService: PersonneService, private router: Router, private formBuilder: FormBuilder, public compteService: CompteService,
    private gradeService: GradeService) { }

  ngOnInit(): void {
    this.getUtilisateurs();
    this.initForm();
    
    this.getGrades()
    this.setDefault();

  }
  //filtrer par planification

  setDefault() {
    this.selectForm.get("select")?.patchValue(null);
   
    this.addForm.get("role")?.patchValue(null);
  }

  onChangeRole() {

    if (this.selectForm.value.select == 'tous') {
      this.getUtilisateurs();
    }
    if (this.selectForm.value.select == 'ens') {
      this.getEnseignant();
    }
    if (this.selectForm.value.select == 'ds') {
      this.getDs();
    }
    if (this.selectForm.value.select == 'admin') {
      this.getAdmin();
    }


  }

  onChangeRoleAdd() {

    this.selectRole = this.addForm.value.role;
    console.log(this.selectRole);


  }
  public getGrades(): void {

    this.gradeService.getAllGrades().subscribe(
      response => {
        this.grades = response;
        console.log(this.grades);
        this.addForm.get("idGrade")?.patchValue(this.grades[0]);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  getUtilisateurs(): void {

    this.personneService.getPersonnes().subscribe(
      response => {
        this.utilisateurs = response;
        
        for (let user of this.utilisateurs) {
          this.getRoleUser(user);
        }
        


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  getEnseignant(): void {

    this.personneService.getEnseignants().subscribe(
      response => {
        this.utilisateurs = response;
        console.log(this.utilisateurs);

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  getDs(): void {

    this.personneService.getDirecteurStages().subscribe(
      response => {
        this.utilisateurs = response;
        console.log(this.utilisateurs);

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  getAdmin(): void {

    this.personneService.getAdmins().subscribe(
      response => {
        this.utilisateurs = response;
        console.log(this.utilisateurs);

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  getRoleUser(p: Personne) {

    this.personneService.getPersonneRoleById(p.id_pers).subscribe(
      (response: string) => {
        console.log("role " + response);
        if (response == 'admin') this.roles[p.id_pers] = "Admin";
        if (response == 'ds') this.roles[p.id_pers] = "Directeur de stages";
        if (response == 'ens') this.roles[p.id_pers] = "Enseignant";



      },
      (error: HttpErrorResponse) => { alert(error.message); }

    );

  }
  //chercher user______________________________________________________________

  public chercherMatieres(key: string): void {
    console.log(key);
    const results: Personne[] = [];
    for (const user of this.utilisateurs) {
      if (user.nom_pers.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || user.prenom_pers.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || user.email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || user.id_pers.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.utilisateurs = results;
    if (results.length === 0 || !key) {
      this.getUtilisateurs();
    }
  }

  //--modifier utilisateur _______________________________________________________________

  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");

  }

  get editF() { return this.editForm.controls; }


  initForm() {

    this.editForm = this.formBuilder.group(
      {
        nom_pers: ['', [Validators.required]],
        prenom_pers: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        date_naiss: ['', [Validators.required]],
        idGrade: [''],

      }
    );
    this.editCompteForm = this.formBuilder.group(
      {
        login: ['', [Validators.required]],
        mdp: ['', [Validators.required]],

      }
    );
    this.addForm = this.formBuilder.group(
      {
        nom_pers: ['', [Validators.required]],
        prenom_pers: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        date_naiss: [''],
        idGrade: [''],
        role: ['', [Validators.required]]
      }
    );
    this.selectForm = this.formBuilder.group({
      select: new FormControl('')
    });


  }

  editUser(personne: Personne) {

    this.updatePersonne = personne;
    this.personneService.getPersonneRoleById(this.updatePersonne.id_pers).subscribe(
      (response: any) => {
        this.role = response; console.log("helloo" + this.role);
        if (this.role === 'ens') {
          this.personneService.getEnseignantById(this.updatePersonne.id_pers).subscribe(
            (response: any) => {
              let ens: Enseignant = response;
              if (ens.idGrade)
                this.editForm.get("idGrade")?.patchValue(ens.idGrade.id_grade);
              else this.editForm.get("idGrade")?.patchValue(null);
            },
            (error: HttpErrorResponse) => { alert(error.message); });

        }

      },

      (error: HttpErrorResponse) => { alert(error.message); }

    );

    this.editForm.controls["nom_pers"].setValue(this.updatePersonne.nom_pers);
    this.editForm.controls["prenom_pers"].setValue(this.updatePersonne.prenom_pers);
    this.editForm.controls["email"].setValue(this.updatePersonne.email);
    this.editForm.controls["date_naiss"].setValue(formatDate(this.updatePersonne.date_naiss, 'yyyy-MM-dd', 'fr'));


    console.log(this.editForm);

    $("#editUser").modal("show");
  }

  onEditUser() {

    console.log(this.updatePersonne.id_pers);



    this.submitted = true;

    if (this.editForm.invalid) { return; }

    if (this.submitted) {

      let listePersonnes: Personne[] = [];
      for (let p of this.utilisateurs) { listePersonnes.push(p); }
      let newP:Personne=new Personne(); newP.email=this.editForm.value.email;
      
      let index = listePersonnes.findIndex(x => x.id_pers == this.updatePersonne.id_pers)
      listePersonnes.splice(index, 1);
  
      if (this.personneService.existsPersonne(listePersonnes, newP) == false) {

      this.personneService.getPersonneRoleById(this.updatePersonne.id_pers).subscribe(
        (response: any) => {
          this.role = response; console.log("helloo" + this.role);



          let editPersonne: any = this.updatePersonne;

          editPersonne.nom_pers = this.editForm.value.nom_pers;
          editPersonne.prenom_pers = this.editForm.value.prenom_pers;
          editPersonne.email = this.editForm.value.email;
          editPersonne.date_naiss = this.editForm.value.date_naiss;

          console.log(editPersonne)

          if (this.role == 'ens') {
            editPersonne.idGrade.id_grade = this.editForm.value.idGrade;

            this.personneService.updateEnseignant(editPersonne).subscribe(
              response => {

                Swal.fire({
                  title: 'Succés!!',
                  text: "compte modifié avec succés",
                  icon: 'success'
                });
                $("#editUser").modal("hide");
              },
              (error: HttpErrorResponse) => { alert(error.message); }
            );


          }
          else if (this.role == "ds") {
            this.personneService.updateDs(editPersonne).subscribe(
              response => {

                console.log(editPersonne);
                Swal.fire({
                  title: 'Succés!!',
                  text: "compte modifié avec succés",
                  icon: 'success'
                });
                $("#editUser").modal("hide");
              },
              (error: HttpErrorResponse) => { alert(error.message); }
            );

          }
          else if (this.role == 'admin') {

            this.personneService.updateAdmin(editPersonne).subscribe(
              response => {
                console.log(editPersonne);
                Swal.fire({
                  title: 'Succés!!',
                  text: "compte modifié avec succés",
                  icon: 'success'
                });
                $("#editUser").modal("hide");
              },
              (error: HttpErrorResponse) => { alert(error.message); }
            );

          }

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      );
    }
    else{
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>L'adresse email <b>'" + newP.email + "'</b>  existe déja. ",
        icon: 'warning'
      });

    }
    }

  }

  //--modifier compte__________________________________________________________________

  get editCF() { return this.editCompteForm.controls; }
  editCompte(personne: Personne) {

    this.updatePersonne = personne;
    if (this.updatePersonne.idCompte) {
      this.editCompteForm.controls["login"].setValue(this.updatePersonne.idCompte.login);
      this.editCompteForm.controls["mdp"].setValue(this.updatePersonne.idCompte.mdp);

    }
    $("#editCompte").modal("show");
  }
  public onEditCompte() {

    this.submittedCompte = true;
    if (this.submittedCompte) {
      if (this.editCompteForm.invalid) { return; }


      let listeComptes: Compte[] = [];
      for (let p of this.utilisateurs) { listeComptes.push(p.idCompte); }
      let newC:Compte=new Compte(); newC.login=this.editCompteForm.value.login;newC.mdp=this.editCompteForm.value.mdp;
      
      let index = listeComptes.findIndex(x => x.id_compte == this.updatePersonne.idCompte.id_compte)
      listeComptes.splice(index, 1);
      console.log("index "+index)
  
      if (this.compteService.existsCompte(listeComptes, newC) == false) {


      var compte = new Compte();
      compte = this.updatePersonne.idCompte;

      compte.login = this.editCompteForm.value.login;
      compte.mdp = this.editCompteForm.value.mdp;


      this.compteService.updateCompte(compte).subscribe(
        response => {

          Swal.fire({
            title: 'Succés!!',
            text: "Compte modifié avec succés",
            icon: 'success'
          });


          $("#editCompte").modal("hide");

        },
        (error: HttpErrorResponse) => { alert(error.message); }
      );

    }
    else {
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>Veuillez changer vos informations de connexion ",
        icon: 'warning'
      });

    }


    }
  }

  //supprimer utilisateur -> suppression automatique du compte _____________________________________________________________

  deletedUser(p: Personne) {
    $("#deleteUser").modal("show");
    this.deletePersonne = p;
  }

  public onDeleteUser(user_Id: any): void {

    this.personneService.deletePersonne(user_Id).subscribe(
      (response: void) => {
        console.log(response);
        $("#deleteUser").modal("hide");
        this.getUtilisateurs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }

  //ajouter utilisateur -> ajout automatique compte______________________________________________

  get addF() { return this.addForm.controls; }

  addUser() {
    $("#addUser").modal("show");
  }
  onAddUser() {
    this.submitted = true;
    if (this.addForm.invalid) { return; }
    if (this.submitted) {




      let p = new Personne();

      p.nom_pers = this.addForm.value.nom_pers;
      p.prenom_pers = this.addForm.value.prenom_pers;
      p.email = this.addForm.value.email;
      p.date_naiss = this.addForm.value.date_naiss;
      if (this.personneService.existsPersonne(this.utilisateurs, p) == false) {

        let newUser: any = p;

        if (this.addForm.value.role == 'ens') {
          newUser.idGrade = this.addForm.value.idGrade;
          this.personneService.addEnseignant(newUser).subscribe(
            response => {
              console.log(newUser);
            },
            (error: HttpErrorResponse) => { alert(error.message); }
          );
        }
        else if (this.addForm.value.role == 'ds') {
          this.personneService.addDs(newUser).subscribe(
            response => {
              console.log(newUser);
            },
            (error: HttpErrorResponse) => { alert(error.message); }
          );
        }
        else if (this.addForm.value.role == 'admin') {
          this.personneService.addAdmin(newUser).subscribe(
            response => {
              console.log(newUser);
            },
            (error: HttpErrorResponse) => { alert(error.message); }
          );

        }

        this.personneService.getPersonnes().subscribe(
          response => {
            this.utilisateurs = response;
            $("#addUser").modal("hide");

            Swal.fire({
              title: 'Succés!!',
              text: "Utilisateur ajoutée avec succés",
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();
            this.personneService.getPersonnes().subscribe(
              response => {
                this.utilisateurs = response;
                this.getUtilisateurs();

              });
          });


      }
      else {
        Swal.fire({
          title: 'Erreur!!',
          html: "<br>L'adresse email' <b>'" + p.email + "'</b> existe déja. ",
          icon: 'warning'
        });

      }



    }

  }


}
