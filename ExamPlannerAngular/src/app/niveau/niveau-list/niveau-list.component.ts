import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Niveau } from 'src/app/models/niveau';
import { Parcours } from 'src/app/models/parcours';
import { NiveauService } from 'src/app/services/niveau.service';
import { ParcoursService } from 'src/app/services/parcours.service';
import Swal from 'sweetalert2';
declare let $: any;


@Component({
  selector: 'app-niveau-list',
  templateUrl: './niveau-list.component.html',
  styleUrls: ['./niveau-list.component.css']
})
export class NiveauListComponent implements OnInit {

  parcours!:Parcours[];
  
  niveaux!: Niveau[];

  
  addForm!:FormGroup;
  editForm!:FormGroup;
  public deleteNiveau !:Niveau;
  public updateNiveau!:Niveau;
  submitted=false;
  
  constructor(
    private niveauService: NiveauService,
  private parcoursService:ParcoursService,  private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.initForm();
    this.getNiveaux();
    this.setDefault();
    this.getParcours();
  }

  public getNiveaux(): void {

    this.niveauService.getNiveaux().subscribe(
      response => {
        this.niveaux = response;
        console.log(this.niveaux);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  public getParcours(): void {

    this.parcoursService.getParcours().subscribe(
      response => {
        this.parcours= response;
        console.log(this.parcours);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  setDefault(){
   
    
    this.addForm.get("idParcours")?.patchValue(null);
   
    
  }

// etat niveau_______________________________________________________________________

checkEtat(niveau: Niveau) {
    
  let checkBox = document.getElementById("flexSwitchCheckChecked"+niveau.id_niv) as HTMLInputElement | null;

  var editNiveau = niveau;
  let etat:string

  if (checkBox?.checked) {
  

    editNiveau.etat_niv = true;
     etat="activé"
  }
  else {
    editNiveau.etat_niv = false;
     etat="désactivé"
  }
  this.niveauService.updateNiveau(editNiveau).subscribe(
    response => {
      console.log(editNiveau);
      
      this.niveauService.getNiveaux().subscribe(
        response => {
          this.niveaux = response;
          Swal.fire({
            title: 'Succés!!',
            text: "vous avez "+ etat+" le niveau "+niveau.nom_niv,
            icon: 'success'
          });
          $('#datatableexample').DataTable().destroy();
          this.niveauService.getNiveaux().subscribe(
  
            response => {
              this.niveaux = response;
  
            });
        });


    },
    (error: HttpErrorResponse) => { alert(error.message); }
  );

}
//chercher niveau _______________________________________________________________

public chercherNiveaux(key: string): void {
  console.log(key);
  const results: Niveau[] = [];
  for (const niveau of this.niveaux) {
    if (niveau.nom_niv.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
      
      || niveau.idParcours.nom_par.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
      || niveau.id_niv.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(niveau);
    }
  }
  this.niveaux = results;
  if (results.length === 0 || !key) {
    this.getNiveaux();
  }
}



initForm(){
  this.addForm=this.formBuilder.group(
    {nom_niv:['',[Validators.required]],
  
    idParcours:['',[Validators.required]],
    etat_niv:['']
    }
  );
  this.editForm=this.formBuilder.group(
    {nom_niv:['',[Validators.required]],
    idParcours:['',[Validators.required]],
    
    etat_niv:['']
    }
  );

}
//ajouter_____________________________________________________________________

addNiveau() {
  $("#addNiveau").modal("show");
}
onDismiss(idModal:any)
{
  $("#"+idModal).modal("hide");

}

get addF() { return this.addForm.controls; }

onAddNiveau() {
  console.log(this.addForm.value.idNiveau)
  this.submitted = true;
  if(this.addForm.invalid){return;}
  if (this.submitted) {

    let checkBoxActive = document.getElementById("etat_nivActive") as HTMLInputElement | null;
   

    var newNiveau:Niveau=new Niveau();

    newNiveau.nom_niv=this.addForm.value.nom_niv;
   
    
    if (checkBoxActive?.checked) {
    newNiveau.etat_niv=true;} else  newNiveau.etat_niv=false
    
    newNiveau.idParcours=this.addForm.value.idParcours;

 

if(this.niveauService.existeNiveau(this.niveaux,newNiveau)==false)
    {
      
      this.niveauService.addNiveau(newNiveau).subscribe(
      response => { console.log(newNiveau); 
      
          this.niveauService.getNiveaux().subscribe(
      response => {
        this.niveaux = response;
        $("#addNiveau").modal("hide");

        Swal.fire({
          title: 'Succés!!',
          text: "niveau ajouté avec succés",
          icon: 'success'
        });
        $('#datatableexample').DataTable().destroy();   
        this.niveauService.getNiveaux().subscribe(

          response => {
            this.niveaux = response;

          });
      });
      
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );

    }
    else{
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>Le niveau <b>'" + newNiveau.nom_niv + "'</b>  existe déja. ",
        icon: 'warning'
      });

    }

  }

}

 //editNiveau___________________________________________________________________
 
 
 
 editNiveau(niveau:Niveau) {
    
  this.updateNiveau=niveau;
 
  

  
  this.editForm.controls["nom_niv"].setValue(niveau.nom_niv);
  
 
  if(niveau.idParcours) this.editForm.get("idParcours")?.patchValue(this.updateNiveau.idParcours.id_par);
  else this.editForm.get("idParcours")?.patchValue(null);
  
  $("#editNiveau").modal("show");
}

get editF() { return this.editForm.controls; }

onEditNiveau() {
  this.submitted = true;
  if(this.editForm.invalid){return;}
  if (this.submitted) {
    let checkBoxActive = document.getElementById("etat_nivActiveEdit") as HTMLInputElement | null;
    
    let listeNiveau: Niveau[] = [];
    for (let n of this.niveaux) { listeNiveau.push(n); }
    let newN:Niveau=new Niveau(); newN.nom_niv=this.editForm.value.nom_niv;
    
    let index = listeNiveau.findIndex(x => x.id_niv == this.updateNiveau.id_niv)
    listeNiveau.splice(index, 1);

    if (this.niveauService.existeNiveau(listeNiveau, newN) == false) {

    var editNiveau=this.updateNiveau;
    editNiveau.nom_niv=this.editForm.value.nom_niv;
    
    
    if (checkBoxActive?.checked) {
    editNiveau.etat_niv=true;} else  editNiveau.etat_niv=false
    

    this.niveauService.updateNiveau(editNiveau).subscribe(
      response => { console.log(editNiveau); 
        this.niveauService.getNiveaux().subscribe(
          response => {
            this.niveaux = response;
            $("#editNiveau").modal("hide");
  
            Swal.fire({
              title: 'Succés!!',
              text: "niveau modifié avec succés",
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();   
            this.niveauService.getNiveaux().subscribe(
  
              response => {
                this.niveaux = response;
  
              });
          });
        
        },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
  }
  else {
    console.log(true)
    Swal.fire({
      title: 'Erreur!!',
      html: "<br>Le Niveau <b>'" + newN.nom_niv + "'</b>  existe déja. ",
      icon: 'warning'
    });

  }



  }

}

//supprimer niveau___________________________________________________________

deletedNiveau(niveau:Niveau) {
  $("#deleteNiveau").modal("show");
  this.deleteNiveau=niveau;
}

public onDeleteNiveau(niveau_Id: any): void {

this.niveauService.deleteNiveau(niveau_Id).subscribe(
  (response: void) => {
    console.log(response);
    $("#deleteNiveau").modal("hide");
    this.getNiveaux();
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  });

}


}
