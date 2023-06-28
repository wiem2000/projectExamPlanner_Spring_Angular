import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Planification } from 'src/app/models/planification';
import { PlanificationService } from 'src/app/services/planification.service';
import Swal from 'sweetalert2';
declare let $: any;
import { formatDate } from '@angular/common'






@Component({
  selector: 'app-planification-list',
  templateUrl: './planification-list.component.html',
  styleUrls: ['./planification-list.component.css']
})
export class PlanificationListComponent implements OnInit {




  public planifications!: Planification[];

  addForm!: FormGroup;
  editForm!: FormGroup;
  selectForm!: FormGroup;



  public editPlanification !: Planification;
  public deletePlanification !: Planification;

  submitted = false;



  constructor(private planificationService: PlanificationService, private router: Router, private formBuilder: FormBuilder) { // this.newPlanification=new Planification();
  }

  ngOnInit(): void {
    this.getPlanifications();
    this.initForm();
    this.setDefault();


  }
  public getPlanifications(): void {

    this.planificationService.getPlanificatins().subscribe(
      response => {
        this.planifications = response;
        console.log(this.planifications)


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )


  }

  onPlanifDetail(planif: any) {

    this.router.navigateByUrl(`planifications/${planif.id_planif}`);


  }

  addPlanification() {

    $("#addPlanification").modal("show");
  }

  get addF() { return this.addForm.controls; }
  get editF() { return this.editForm.controls; }

  onAddPlanification() {
    this.submitted = true;
    if (this.addForm.invalid) { return; }
    if (this.submitted) {

      var newPlanification = new Planification();

      newPlanification.type_session = this.addForm.value.type_session;
      newPlanification.date_debut = this.addForm.value.date_debut;
      newPlanification.date_fin = this.addForm.value.date_fin;
      newPlanification.semestre = this.addForm.value.semestre;
      newPlanification.nb_seance_jour = this.addForm.value.nb_seance_jour;

      this.planificationService.addPlanification(newPlanification).subscribe(
        response => { console.log(newPlanification); },
        (error: HttpErrorResponse) => { alert(error.message); }
      );
      this.planificationService.getPlanificatins().subscribe(
        response => {
          this.planifications = response;
          $("#addPlanification").modal("hide");

          Swal.fire({
            title: 'Succés!!',
            text: "planification ajoutée avec succés",
            icon: 'success'
          });
          $('#datatableexample').DataTable().destroy();
          this.planificationService.getPlanificatins().subscribe(

            response => {
              this.planifications = response;

            });
        });


    }

  }

  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");


  }


  updatePlanification(planif: Planification) {
    this.editForm.controls["type_session"].setValue(planif.type_session);

    this.editForm.controls["date_debut"].setValue(formatDate(planif.date_debut, 'yyyy-MM-dd', 'fr'));

    this.editForm.controls["date_fin"].setValue(formatDate(planif.date_fin, 'yyyy-MM-dd', 'fr'));
    this.editForm.controls["nb_seance_jour"].setValue(planif.nb_seance_jour);
    this.editForm.controls["semestre"].setValue(planif.semestre);




    this.editPlanification = planif;
    $("#updatePlanification").modal("show");
  }

  onUpdatePlanification() {


    this.submitted = true;
    if (this.editForm.invalid) { return; }
    if (this.submitted) {
      var editPlanification = new Planification();
      editPlanification.id_planif = this.editPlanification.id_planif;
      editPlanification.type_session = this.editForm.value.type_session;
      editPlanification.date_debut = this.editForm.value.date_debut;
      editPlanification.date_fin = this.editForm.value.date_fin;
      editPlanification.semestre = this.editForm.value.semestre;
      editPlanification.nb_seance_jour = this.editForm.value.nb_seance_jour;


      this.planificationService.updatePlanification(editPlanification).subscribe(
        response => { console.log(editPlanification); },
        (error: HttpErrorResponse) => { alert(error.message); }
      );
      this.planificationService.getPlanificatins().subscribe(
        response => {
          this.planifications = response;
          $("#updatePlanification").modal("hide");

          Swal.fire({
            title: 'Succés!!',
            text: "planification modifiée avec succés",
            icon: 'success'
          });
          $('#datatableexample').DataTable().destroy();
          this.planificationService.getPlanificatins().subscribe(

            response => {
              this.planifications = response;

            });
        });


    }

  }

  public onDeletePlanification(planif_Id: any): void {

    this.planificationService.deletePlanification(planif_Id).subscribe(
      (response: void) => {

        $("#deletePlanification").modal("hide");
        this.getPlanifications();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }

  deletedPlanification(planif: Planification) {
    $("#deletePlanification").modal("show");

    this.deletePlanification = planif;
  }

  initForm() {
    this.addForm = this.formBuilder.group(
      {
        type_session: ['', [Validators.required]],
        date_debut: ['', [Validators.required]],
        date_fin: ['', [Validators.required]],
        semestre: ['', [Validators.required,Validators.pattern("^[1-2]*$")]],
        nb_seance_jour: ['', [Validators.required,Validators.pattern("^[1-4]*$")]]

      }
    );
    this.editForm = this.formBuilder.group(
      {
        type_session: ['', [Validators.required]],
        date_debut: ['', [Validators.required]],

        date_fin: ['', [Validators.required]],
        semestre: ['', [Validators.required,Validators.pattern("^[1-2]*$")]],
        nb_seance_jour: ['', [Validators.required,Validators.pattern("^[1-4]*$")]]

      }
    );
    this.selectForm = this.formBuilder.group({
      select: new FormControl(''),
      selectSemestre: new FormControl(''),
      selectYear: new FormControl(''),

    });



  }

  setDefault() {
    this.selectForm.get("select")?.patchValue(('tous'));
    this.selectForm.get("selectSemestre")?.patchValue(('tous'));
  }

onFiltrer(){

  let session=this.selectForm.value.select;
 let semestre= this.selectForm.value.selectSemestre;
  let year=this.selectForm.value.selectYear;
  var annee = year.substr(0, 4)
  var mois = year.substr(5, 2)

  const results: Planification[] = [];

 if(session!='tous' && semestre!='tous' && year!='')
  {for (const planif of this.planifications) {
    if (planif.type_session==session && planif.semestre==semestre && new Date(planif.date_debut).toLocaleDateString().indexOf(annee) !== -1
    && new Date(planif.date_debut).toLocaleDateString().substring(3, 9).indexOf(mois) !== -1  ) {
      results.push(planif);
    }
  }
}

else if(session=='tous' && semestre!='tous' && year!='')
{
  for (const planif of this.planifications) {
    if ( planif.semestre==semestre && new Date(planif.date_debut).toLocaleDateString().indexOf(annee) !== -1
    && new Date(planif.date_debut).toLocaleDateString().substring(3, 9).indexOf(mois) !== -1  ) {
      results.push(planif);
    }
  }

}
else if(session!='tous' && semestre=='tous' && year!='')
{
  for (const planif of this.planifications) {
    if (planif.type_session==session && new Date(planif.date_debut).toLocaleDateString().indexOf(annee) !== -1
    && new Date(planif.date_debut).toLocaleDateString().substring(3, 9).indexOf(mois) !== -1  ) {
      results.push(planif);
    }
  }

}
else if(session!='tous' && semestre!='tous' && year=='')
{
  for (const planif of this.planifications) {
    if (planif.type_session==session && planif.semestre==semestre  ) {
      results.push(planif);
    }
  }

}
else if(session=='tous' && semestre=='tous' && year!='')
{
  for (const planif of this.planifications) {
    if ( new Date(planif.date_debut).toLocaleDateString().indexOf(annee) !== -1
    && new Date(planif.date_debut).toLocaleDateString().substring(3, 9).indexOf(mois) !== -1  ) {
      results.push(planif);
    }
  }

}
else if(session=='tous'||session==null && semestre!='tous' && year=='')
{
  for (const planif of this.planifications) {
    if ( planif.semestre==semestre  ) {
      results.push(planif);
    }
  }

}
else if(session!='tous' && semestre=='tous' && year=='')
{
  for (const planif of this.planifications) {
    if (planif.type_session==session  ) {
      results.push(planif);
    }
  }

}
else {
  this.getPlanifications();
}


  this.planifications = results;
  if (results.length === 0 ) {
    this.getPlanifications();
  }   
}






}
