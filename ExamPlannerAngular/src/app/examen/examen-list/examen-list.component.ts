import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Examen } from 'src/app/models/examen';
import { Grade } from 'src/app/models/grade';
import { Matiere } from 'src/app/models/matiere';
import { Planification } from 'src/app/models/planification';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { ExamenService } from 'src/app/services/examen.service';
import { GradeService } from 'src/app/services/grade.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { PlanificationService } from 'src/app/services/planification.service';
import Swal from 'sweetalert2';
declare let $: any;



@Component({
  selector: 'app-examen-list',
  templateUrl: './examen-list.component.html',
  styleUrls: ['./examen-list.component.css']
})
export class ExamenListComponent implements OnInit {


  examens!: Examen[];
  matieres!: Matiere[];
  planifications!: Planification[];
  data!: Planification;


  addForm!: FormGroup;
  editForm!: FormGroup;
  selectForm!: FormGroup;
  public updateExamen!: Examen;
  public deleteExamen !: Examen;

  submitted = false;

  constructor(private examenService: ExamenService, private matiereService: MatiereService, private planificationService: PlanificationService,

    private formBuilder: FormBuilder,
  ) {

    // this.newExamen=new Examen();
  }

  ngOnInit(): void {
    this.getExamens();
    this.initForm();
    this.getMatieres();
    this.getPlanifications();
    this.setDefault();



  }

  public getExamens(): void {

    this.examenService.getAllExamen().subscribe(
      response => {
        this.examens = response;
        console.log(this.examens);
        var examen0 = document.getElementById("examen0") as HTMLInputElement | null;
        if (examen0) {
          if (this.examens?.length == 0)

            examen0.style.display = "block";
          else
            examen0.style.display = "none";
        }

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  public getMatieres(): void {

    this.matiereService.getAllMatieres().subscribe(
      response => {
        this.matieres = response;
        console.log(this.matieres);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  public getPlanifications(): void {

    this.planificationService.getPlanificatins().subscribe(
      response => {
        this.planifications = response;
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    )

  }
  public chercherExamens(key: string): void {
    console.log(key);
    const results: Examen[] = [];
    for (const examen of this.examens) {
      if (examen.nom_exam.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || examen.type_exam.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || examen.idMatiere?.nom_mat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || examen.idMatiere?.idModule?.idNiveau?.nom_niv.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || examen.id_exam.toString().indexOf(key) !== -1) {
        results.push(examen);
      }
    }
    this.examens = results;
    if (results.length === 0 || !key) {
      this.getExamens();
    }
  }
  //filtrer par planification

  setDefault() {
    this.selectForm.get("select")?.patchValue(null);
  }

  onChangePlanif(planif: Planification) {

    if (this.selectForm.value.select == 'tous') {
      this.getExamens();
    }
    else {
      if (planif) {


        this.examenService.getAllExamenByPlanification(planif.id_planif).subscribe(
          response => {
            this.examens = response;
            console.log(this.examens);
            var examen0 = document.getElementById("examen0") as HTMLInputElement | null;
            if (examen0) {
              if (this.examens?.length == 0)

                examen0.style.display = "block";
              else
                examen0.style.display = "none";
            }

          },
          (error: HttpErrorResponse) => { alert(error.message); }

        )
      }
    }

  }


  //init form-----------------------------

  initForm() {
    /*
    this.addForm = this.formBuilder.group(
      {
        nom_exam: ['', [Validators.required]],
        type_exam: ['', [Validators.required]],
        nb_heure: ['', [Validators.required]],
        idMatiere: ['', [Validators.required]],
        nb_etud: ['', [Validators.required]]
      }
    );*/
    this.editForm = this.formBuilder.group(
      {
        nom_exam: ['', [Validators.required]],
        type_exam: ['', [Validators.required]],
        nb_heure: ['', [Validators.required,Validators.min(1),Validators.max(1.5)]],
        nb_etud: ['', [Validators.required,Validators.pattern("^[0-9]*$")]]
      }
    );
    this.selectForm = this.formBuilder.group({
      select: new FormControl('')
    });
  }

  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");
    


  }
  //ajouter examen---------------------------------
/*
  addExamen() {
    $("#addExamen").modal("show");
  }




  get f() { return this.addForm.controls; }


  onAddExamen() {
    this.submitted = true;
    if (this.addForm.invalid) { return; }
    if (this.submitted) {

      var newExamen = new Examen();

      newExamen.nom_exam = this.addForm.value.nom_exam;
      newExamen.type_exam = this.addForm.value.type_exam;
      newExamen.nb_heure = this.addForm.value.nb_heure;
      newExamen.idMatiere = this.addForm.value.idMatiere;
      newExamen.nb_etud = this.addForm.value.nb_etud;


      this.examenService.addExamen(newExamen).subscribe(
        response => {
          console.log(newExamen);



          this.examenService.getAllExamen().subscribe(
            response => {
              this.examens = response;
              $("#addExamen").modal("hide");

              Swal.fire({
                title: 'Succés!!',
                text: "examen ajoutée avec succés",
                icon: 'success'
              });
              $('#datatableexample').DataTable().destroy();
              this.examenService.getAllExamen().subscribe(

                response => {
                  this.examens = response;

                });
            });



        },
        (error: HttpErrorResponse) => { alert(error.message); }
      );



    }

  }
*/

  //modifier examen -------------------------------------

  get editF() { return this.editForm.controls; }

  editExamen(examen: Examen) {
    this.editForm.controls["nom_exam"].setValue(examen.nom_exam);
    this.editForm.controls["type_exam"].setValue(examen.type_exam);
    this.editForm.controls["nb_heure"].setValue(examen.nb_heure);
    this.editForm.controls["nb_etud"].setValue(examen.nb_etud);

    this.updateExamen = examen;
    $("#editExamen").modal("show");
  }

  onEditExamen() {
    this.submitted = true;
    if (this.editForm.invalid) { return; }
    if (this.submitted) {

      let editExamen = this.updateExamen;


      editExamen.nom_exam = this.editForm.value.nom_exam;
      editExamen.type_exam = this.editForm.value.type_exam;
      editExamen.nb_heure = this.editForm.value.nb_heure;
      editExamen.nb_etud = this.editForm.value.nb_etud;


      this.examenService.updateExamen(editExamen).subscribe(
        response => {
          console.log(editExamen);

          this.examenService.getAllExamen().subscribe(
            response => {
              this.examens = response;
              $("#editExamen").modal("hide");

              Swal.fire({
                title: 'Succés!!',
                text: "examen modifié avec succés",
                icon: 'success'
              });
              $('#datatableexample').DataTable().destroy();
              this.examenService.getAllExamen().subscribe(

                response => {
                  this.examens = response;

                });
            });

        },
        (error: HttpErrorResponse) => { alert(error.message); }
      );





    }

  }

  //supprimer examen-----------------------------------------------

  deletedExamen(examen: Examen) {
    $("#deleteExamen").modal("show");
    this.deleteExamen = examen;
  }

  public onDeleteExamen(exam_Id: any): void {

    this.examenService.deleteExamen(exam_Id).subscribe(
      (response: void) => {
        console.log(response);
        $("#deleteExamen").modal("hide");
        this.getExamens();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }









}
