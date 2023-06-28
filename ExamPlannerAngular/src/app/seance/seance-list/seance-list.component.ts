import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seance } from 'src/app/models/seance';
import { SeanceService } from 'src/app/services/seance.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-seance-list',
  templateUrl: './seance-list.component.html',
  styleUrls: ['./seance-list.component.css']
})
export class SeanceListComponent implements OnInit {

  seances!:Seance[];
  addForm!:FormGroup;
  editForm!:FormGroup;
  public deleteSeance !:Seance;
  public updateSeance!:Seance;
  submitted=false;
  
  constructor(private seanceService: SeanceService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.initForm();
    this.getSeances();
    
   
  }

  public getSeances(): void {

    this.seanceService.getSeances().subscribe(
      response => {
        this.seances = response;
        console.log(this.seances);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }


  

//chercher seance _______________________________________________________________

public chercherSeances(key: string): void {
  console.log(key);
  const results: Seance[] = [];
  for (const seance of this.seances) {
    if ( seance. num_seance.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(seance);
    }
  }
  this.seances = results;
  if (results.length === 0 || !key) {
    this.getSeances();
  }
}



initForm(){
  this.addForm=this.formBuilder.group(
    { 
    heure_debut:['',[Validators.required]],
    heure_fin:['',[Validators.required]],
    }
  );
  this.editForm=this.formBuilder.group(
    { heure_debut:['',[Validators.required]],
    heure_fin:['',[Validators.required]],
   
    }
  );

}
//ajouter_____________________________________________________________________

addSeance() {
  $("#addSeance").modal("show");
}
onDismiss(idModal:any)
{
  $("#"+idModal).modal("hide");

}

get addF() { return this.addForm.controls; }

onAddSeance() {
  
  this.submitted = true;
  if(this.addForm.invalid){return;}
  if (this.submitted) {

  
   

    var newSeance:Seance=new Seance();

   
    newSeance.heure_debut=this.addForm.value.heure_debut;

    newSeance.heure_fin=this.addForm.value.heure_fin;

 

if(this.seanceService.existeSeance(this.seances,newSeance)==false)
   { this.seanceService.addSeance(newSeance).subscribe(
      response => { console.log(newSeance); 
      
          this.seanceService.getSeances().subscribe(
      response => {
        this.seances = response;
        $("#addSeance").modal("hide");

        Swal.fire({
          title: 'Succés!!',
          text: "seance ajoutée avec succés",
          icon: 'success'
        });
        $('#datatableexample').DataTable().destroy();   
        this.seanceService.getSeances().subscribe(

          response => {
            this.seances = response;

          });
      });
      
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
   }
   else{
    Swal.fire({
      title: 'Erreur!!',
      html: "La séance <b>"+newSeance.heure_debut +" => "+newSeance.heure_fin +"</b> existe déja. ",
      icon: 'warning'
    });

   }



  }

}

 //editSeance___________________________________________________________________
 
 
 
 editSeance(seance:Seance) {
    
  this.updateSeance=seance;
  
  

  this.editForm.controls["heure_debut"].setValue(seance.heure_debut);
  
  this.editForm.controls["heure_fin"].setValue(seance.heure_fin);

  
  $("#editSeance").modal("show");
}

get editF() { return this.editForm.controls; }

onEditSeance() {
  this.submitted = true;
  if(this.editForm.invalid){return;}
  if (this.submitted) {

    let listeSeance: Seance[] = [];
      for (let s of this.seances) { listeSeance.push(s); }
      let newS:Seance=new Seance(); newS.heure_debut=this.editForm.value.heure_debut; newS.heure_fin=this.editForm.value.heure_fin;
      
      let index = listeSeance.findIndex(x => x.num_seance == this.updateSeance.num_seance)
      listeSeance.splice(index, 1);

      if (this.seanceService.existeSeance(listeSeance, newS) == false) {
   

    var editSeance=this.updateSeance;
   
    editSeance.heure_debut=this.editForm.value.heure_debut;
    editSeance.heure_fin=this.editForm.value.heure_fin;

    this.seanceService.updateSeance(editSeance).subscribe(
      response => { console.log(editSeance); 
        this.seanceService.getSeances().subscribe(
          response => {
            this.seances = response;
            $("#editSeance").modal("hide");
  
            Swal.fire({
              title: 'Succés!!',
              text: "seance modifié avec succés",
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();   
            this.seanceService.getSeances().subscribe(
  
              response => {
                this.seances = response;
  
              });
          });
        
        },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
  }
  else{
   Swal.fire({
     title: 'Erreur!!',
     html: "La séance <b>"+newS.heure_debut +" => "+newS.heure_fin +"</b> existe déja. ",
     icon: 'warning'
   });

  }


  }

}

//supprimer seance___________________________________________________________

deletedSeance(seance:Seance) {
  $("#deleteSeance").modal("show");
  this.deleteSeance=seance;
}

public onDeleteSeance(seance_Id: any): void {

this.seanceService.deleteSeance(seance_Id).subscribe(
  (response: void) => {
    console.log(response);
    $("#deleteSeance").modal("hide");
    this.getSeances();
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  });

}


}
