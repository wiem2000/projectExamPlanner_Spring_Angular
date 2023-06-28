import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.css']
})
export class GradeListComponent implements OnInit {

  grades!:Grade[];
  addForm!:FormGroup;
  editForm!:FormGroup;
  public deleteGrade !:Grade;
  public updateGrade!:Grade;
  submitted=false;
  
  constructor(private gradeService: GradeService,private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.getGrades();
    this.initForm();
  }
  public getGrades(): void {

    this.gradeService.getAllGrades().subscribe(
      response => {
        this.grades = response;
        console.log(this.grades);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  //chercher matiere _______________________________________________________________

  public chercherGrade(key: string): void {
    console.log(key);
    const results: Grade[] = [];
    for (const grade of this.grades) {
      if (grade.nom_grade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
       
        || grade.id_grade.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(grade);
      }
    }
    this.grades = results;
    if (results.length === 0 || !key) {
      this.getGrades();
    }

  }
  //init form_______________________________________________________________________

  initForm(){
    this.addForm=this.formBuilder.group(
      {nom_grade:['',[Validators.required]],
      charge_surv:['',[Validators.required,Validators.pattern("^[0-9]*$")]],
    
      }
    );
    this.editForm=this.formBuilder.group(
      { nom_grade:['',[Validators.required]],
      charge_surv:['',[Validators.required,Validators.pattern("^[0-9]*$")]],
      }
    );
 
  }

  //ajouter grade_____________________________________________________________________

  addGrade() {
    $("#addGrade").modal("show");
  }
  onDismiss(idModal:any)
  {
    $("#"+idModal).modal("hide");

  }

  get addF() { return this.addForm.controls; }
  
  onAddGrade() {
    this.submitted = true;
    if(this.addForm.invalid){return;}
    if (this.submitted) {

     

      var newGrade=new Grade();

      newGrade.nom_grade=this.addForm.value.nom_grade;
      newGrade.charge_surv=this.addForm.value.charge_surv;

   

      if(this.gradeService.existeGrade(this.grades,newGrade)==false)
      {
        
      this.gradeService.addGrade(newGrade).subscribe(
        response => { console.log(newGrade); 
        
            this.gradeService.getAllGrades().subscribe(
        response => {
          this.grades = response;
          $("#addGrade").modal("hide");

          Swal.fire({
            title: 'Succés!!',
            text: "grade ajoutée avec succés",
            icon: 'success'
          });
          $('#datatableexample').DataTable().destroy();   
          this.gradeService.getAllGrades().subscribe(

            response => {
              this.grades = response;

            });
        });
        
        },
        (error: HttpErrorResponse) => { alert(error.message); }
      );
      }
      else{
        Swal.fire({
          title: 'Erreur!!',
          html: "<br>Le grade <b>'" + newGrade.nom_grade + "'</b>  existe déja. ",
          icon: 'warning'
        });
  
      }


    }

  }
  //editGrade___________________________________________________________________
 
  get editF() { return this.editForm.controls; }
 
  editGrade(grade:Grade) {
  
    this.updateGrade=grade;
    this.editForm.controls["nom_grade"].setValue(grade.nom_grade);
    this.editForm.controls["charge_surv"].setValue(grade.charge_surv);
   
    $("#editGrade").modal("show");
  }
  
  onEditGrade() {
    this.submitted = true;
    if(this.editForm.invalid){return;}
    if (this.submitted) {
      
      let listeGrade: Grade[] = [];
      for (let g of this.grades) { listeGrade.push(g); }
      let newg:Grade=new Grade(); newg.nom_grade=this.editForm.value.nom_grade;
      
      let index = listeGrade.findIndex(x => x.id_grade == this.updateGrade.id_grade)
      listeGrade.splice(index, 1);
  
      if (this.gradeService.existeGrade(listeGrade, newg) == false) {

      var editGrade=this.updateGrade;
      editGrade.nom_grade=this.editForm.value.nom_grade;
      editGrade.charge_surv=this.editForm.value.charge_surv;
 
      this.gradeService.updateGrade(editGrade).subscribe(
        response => { console.log(editGrade); 
          this.gradeService.getAllGrades().subscribe(
            response => {
              this.grades = response;
              $("#editGrade").modal("hide");
    
              Swal.fire({
                title: 'Succés!!',
                text: "Grade modifié avec succés",
                icon: 'success'
              });
              $('#datatableexample').DataTable().destroy();   
              this.gradeService.getAllGrades().subscribe(
    
                response => {
                  this.grades = response;
    
                });
            });
          
          },
        (error: HttpErrorResponse) => { alert(error.message); }
      );
    }
    else{
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>Le grade <b>'" + newg.nom_grade + "'</b>  existe déja. ",
        icon: 'warning'
      });

    }

    }

  }

  //supprimer matiere___________________________________________________________

  deletedGrade(grade:Grade) {
    $("#deleteGrade").modal("show");
    this.deleteGrade=grade;
  }

public onDeleteGrade(grade_Id: any): void {

  this.gradeService.deleteGrade(grade_Id).subscribe(
    (response: void) => {
      console.log(response);
      $("#deleteGrade").modal("hide");
      this.getGrades();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

  }

}
