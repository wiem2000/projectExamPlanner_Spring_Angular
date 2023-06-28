import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Salle } from 'src/app/models/salle';
import { SalleService } from 'src/app/services/salle.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-salle-list',
  templateUrl: './salle-list.component.html',
  styleUrls: ['./salle-list.component.css']
})
export class SalleListComponent implements OnInit {


  salles!:Salle[];
  addForm!:FormGroup;
  editForm!:FormGroup;
  public deleteSalle !:Salle;
  public updateSalle!:Salle;
  submitted=false;
  
  constructor(private salleService: SalleService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.initForm();
    this.getSalles();
    this.setDefault();
   
  }

  public getSalles(): void {

    this.salleService.getSalles().subscribe(
      response => {
        this.salles = response;
        console.log(this.salles);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  setDefault(){
   
    
    this.addForm.get("type_salle")?.patchValue(null);
  
    
  }
  

//chercher salle _______________________________________________________________

public chercherSalles(key: string): void {
  console.log(key);
  const results: Salle[] = [];
  for (const salle of this.salles) {
    if (salle.type_salle.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1

      || salle. num_salle.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(salle);
    }
  }
  this.salles = results;
  if (results.length === 0 || !key) {
    this.getSalles();
  }
}



initForm(){
  this.addForm=this.formBuilder.group(
    { 
    type_salle:['',[Validators.required]],
   
    capacite:['',[Validators.required,Validators.pattern("^[0-9]*$")]],
    
    }
  );
  this.editForm=this.formBuilder.group(
    {num_salle:['',],
    type_salle:['',[Validators.required]],
   
    capacite:['',[Validators.required,Validators.pattern("^[0-9]*$")]],
   
    }
  );

}
//ajouter_____________________________________________________________________

addSalle() {
  $("#addSalle").modal("show");
}
onDismiss(idModal:any)
{
  $("#"+idModal).modal("hide");

}

get addF() { return this.addForm.controls; }

onAddSalle() {
  
  this.submitted = true;
  if(this.addForm.invalid){return;}
  if (this.submitted) {

  
   

    var newSalle:Salle=new Salle();

   
    newSalle.type_salle=this.addForm.value.type_salle;

    newSalle.capacite=this.addForm.value.capacite;

 


    this.salleService.addSalle(newSalle).subscribe(
      response => { console.log(newSalle); 
      
          this.salleService.getSalles().subscribe(
      response => {
        this.salles = response;
        $("#addSalle").modal("hide");

        Swal.fire({
          title: 'Succés!!',
          text: "salle ajoutée avec succés",
          icon: 'success'
        });
        $('#datatableexample').DataTable().destroy();   
        this.salleService.getSalles().subscribe(

          response => {
            this.salles = response;

          });
      });
      
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );



  }

}

 //editSalle___________________________________________________________________
 
 
 
 editSalle(salle:Salle) {
    
  this.updateSalle=salle;
  
  

  this.editForm.controls["num_salle"].setValue(salle.num_salle);
  this.editForm.controls["num_salle"].disable();
  this.editForm.controls["type_salle"].setValue(salle.type_salle);
  this.editForm.controls["capacite"].setValue(salle.capacite);
 
  
  $("#editSalle").modal("show");
}

get editF() { return this.editForm.controls; }

onEditSalle() {
  this.submitted = true;
  if(this.editForm.invalid){return;}
  if (this.submitted) {
   

    var editSalle=this.updateSalle;
   
    editSalle.type_salle=this.editForm.value.type_salle;
    editSalle.capacite=this.editForm.value.capacite;

    this.salleService.updateSalle(editSalle).subscribe(
      response => { console.log(editSalle); 
        this.salleService.getSalles().subscribe(
          response => {
            this.salles = response;
            $("#editSalle").modal("hide");
  
            Swal.fire({
              title: 'Succés!!',
              text: "salle modifié avec succés",
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();   
            this.salleService.getSalles().subscribe(
  
              response => {
                this.salles = response;
  
              });
          });
        
        },
      (error: HttpErrorResponse) => { alert(error.message); }
    );



  }

}

//supprimer salle___________________________________________________________

deletedSalle(salle:Salle) {
  $("#deleteSalle").modal("show");
  this.deleteSalle=salle;
}

public onDeleteSalle(salle_Id: any): void {

this.salleService.deleteSalle(salle_Id).subscribe(
  (response: void) => {
    console.log(response);
    $("#deleteSalle").modal("hide");
    this.getSalles();
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  });

}



}
