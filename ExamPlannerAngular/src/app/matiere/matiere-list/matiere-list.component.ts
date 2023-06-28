import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Matiere } from 'src/app/models/matiere';
import { Module } from 'src/app/models/module';
import { Niveau } from 'src/app/models/niveau';
import { Parcours } from 'src/app/models/parcours';
import { MatiereService } from 'src/app/services/matiere.service';
import { ModuleService } from 'src/app/services/module.service';
import { NiveauService } from 'src/app/services/niveau.service';
import { ParcoursService } from 'src/app/services/parcours.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-matiere-list',
  templateUrl: './matiere-list.component.html',
  styleUrls: ['./matiere-list.component.css']
})
export class MatiereListComponent implements OnInit {

  parcours!:Parcours[];
  matieres!: Matiere[];
  niveaux!: Niveau[];

  modules!:Module[];
  addForm!:FormGroup;
  editForm!:FormGroup;
  public deleteMatiere !:Matiere;
  public updateMatiere!:Matiere;
  submitted=false;

  constructor(private matiereService: MatiereService,private moduleService: ModuleService,
    private niveauService: NiveauService,
  private parcoursService:ParcoursService,  private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.getMatieres();
    this.initForm();
  
    this.setDefault();
    this.getParcours();

    
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
   
    this.addForm.get("idModule")?.patchValue(null);
    this.addForm.get("idParcours")?.patchValue(null);
    this.addForm.get("idNiveau")?.patchValue(null);
    this.addForm.get("regime_mat")?.patchValue(null);
  }

  onChangeParcours(p: Parcours) {
    

    if (p ) {
      console.log(p);

      this.niveauService.getNiveauByParcours(p?.id_par).subscribe(
        response => {
          this.niveaux = response;
          console.log(this.niveaux);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }
  }
  onChangeParcoursEdit(id_par:number) {
    

    if (id_par!=undefined ) {
      console.log(id_par);
      this.niveauService.getNiveauByParcours(id_par).subscribe(
        response => {
          this.niveaux = response;
          console.log(this.niveaux);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }
  }

  onChangeNiveau(n: Niveau) {

    if (n) {
      console.log(n);

      this.moduleService.getModulesByNiveau(n?.id_niv).subscribe(
        response => {
          this.modules = response;
          console.log(this.modules);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }

  }
  onChangeNiveauEdit(id_niv:number) {

    if (id_niv!=undefined) {
      console.log(id_niv);

      this.moduleService.getModulesByNiveau(id_niv).subscribe(
        response => {
          this.modules = response;
          console.log(this.modules);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }

  }
// etat matiere_______________________________________________________________________

  checkEtat(matiere: Matiere) {
    
    let checkBox = document.getElementById("flexSwitchCheckChecked"+matiere.id_mat) as HTMLInputElement | null;

    var editMatiere = matiere;
    let etat:string

    if (checkBox?.checked) {
    

      editMatiere.etat_mat = true;
       etat="activé"
    }
    else {
      editMatiere.etat_mat = false;
       etat="désactivé"
    }
    this.matiereService.updateMatiere(editMatiere).subscribe(
      response => {
        console.log(editMatiere);
        
        this.matiereService.getAllMatieres().subscribe(
          response => {
            this.matieres = response;
            Swal.fire({
              title: 'Succés!!',
              text: "vous avez "+ etat+" la matiere "+matiere.nom_mat,
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();
            this.matiereService.getAllMatieres().subscribe(
    
              response => {
                this.matieres = response;
    
              });
          });


      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
  
  }

//chercher matiere _______________________________________________________________

  public chercherMatieres(key: string): void {
    console.log(key);
    const results: Matiere[] = [];
    for (const matiere of this.matieres) {
      if (matiere.nom_mat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || matiere.regime_mat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || matiere.idModule.nom_mod.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || matiere.idModule.idNiveau.nom_niv.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || matiere.id_mat.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(matiere);
      }
    }
    this.matieres = results;
    if (results.length === 0 || !key) {
      this.getMatieres();
    }
  }
  
  

  initForm(){
    this.addForm=this.formBuilder.group(
      {nom_mat:['',[Validators.required]],
      regime_mat:['',[Validators.required]],
      idModule:['',[Validators.required]],
      idNiveau:['',[Validators.required]],
      idParcours:['',[Validators.required]],
      etat_mat:['']
      }
    );
    this.editForm=this.formBuilder.group(
      {nom_mat:['',[Validators.required]],
      regime_mat:['',[Validators.required]],
      idNiveau:['',[Validators.required]],
      idParcours:['',[Validators.required]],
      idModule:['',[Validators.required]],
      etat_mat:['']
      }
    );
 
  }

//ajouter_____________________________________________________________________

  addMatiere() {
    $("#addMatiere").modal("show");
  }
  onDismiss(idModal:any)
  {
    $("#"+idModal).modal("hide");

  }

  get addF() { return this.addForm.controls; }
  
  onAddMatiere() {
    this.submitted = true;
    if(this.addForm.invalid){return;}
    if (this.submitted) {

      let checkBoxActive = document.getElementById("etat_matActive") as HTMLInputElement | null;
     

      var newMatiere=new Matiere();

      newMatiere.nom_mat=this.addForm.value.nom_mat;
      newMatiere.regime_mat=this.addForm.value.regime_mat;
      
      if (checkBoxActive?.checked) {
      newMatiere.etat_mat=true;} else  newMatiere.etat_mat=false
      
      newMatiere.idModule=this.addForm.value.idModule;

   
      if (this.matiereService.existeMatiere(this.matieres, newMatiere) == false) {


      this.matiereService.addMatiere(newMatiere).subscribe(
        response => { console.log(newMatiere); 
        
            this.matiereService.getAllMatieres().subscribe(
        response => {
          this.matieres = response;
          $("#addMatiere").modal("hide");

          Swal.fire({
            title: 'Succés!!',
            text: "matiere ajoutée avec succés",
            icon: 'success'
          });
          $('#datatableexample').DataTable().destroy();   
          this.matiereService.getAllMatieres().subscribe(

            response => {
              this.matieres = response;

            });
        });
        
        },
        (error: HttpErrorResponse) => { alert(error.message); }
      );
    }
    else {
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>Une matiere ayant le nom <b>'" + newMatiere.nom_mat + "'</b> du parcours <b>" + newMatiere.idModule.idNiveau.idParcours.nom_par + "</b> existe déja . ",
        icon: 'warning'
      });

    }


    }

  }
  //editMatiere___________________________________________________________________
 
 
 
  editMatiere(matiere:Matiere) {
    
    this.updateMatiere=matiere;
    this.onChangeParcours(matiere.idModule?.idNiveau?.idParcours);
    this.onChangeNiveau(matiere.idModule?.idNiveau);
  
    
    this.editForm.controls["nom_mat"].setValue(matiere.nom_mat);
    this.editForm.controls["regime_mat"].setValue(matiere.regime_mat);
   
    if(matiere.idModule) this.editForm.get("idModule")?.patchValue(this.updateMatiere.idModule.id_mod);
    else this.editForm.get("idModule")?.patchValue(null);
   
    if(matiere.idModule.idNiveau) this.editForm.get("idNiveau")?.patchValue(this.updateMatiere?.idModule?.idNiveau?.id_niv);
    else this.editForm.get("idNiveau")?.patchValue(null);
   
    if(matiere.idModule.idNiveau.idParcours) this.editForm.get("idParcours")?.patchValue(this.updateMatiere?.idModule?.idNiveau?.idParcours?.id_par);
    else this.editForm.get("idParcours")?.patchValue(null);
    
    $("#editMatiere").modal("show");
  }
  
  get editF() { return this.editForm.controls; }
  
  onEditMatiere() {
    this.submitted = true;
    if(this.editForm.invalid){return;}
    if (this.submitted) {
      let checkBoxActive = document.getElementById("etat_matActiveEdit") as HTMLInputElement | null;
      var editMatiere=this.updateMatiere;




      
      editMatiere.nom_mat=this.editForm.value.nom_mat;
      editMatiere.regime_mat=this.editForm.value.regime_mat;
      editMatiere.idModule.id_mod=this.editForm.value.idModule;
      
      if (checkBoxActive?.checked) {
      editMatiere.etat_mat=true;} else  editMatiere.etat_mat=false
      

      this.matiereService.updateMatiere(editMatiere).subscribe(
        response => { console.log(editMatiere); 
          this.matiereService.getAllMatieres().subscribe(
            response => {
              this.matieres = response;
              
              $("#editMatiere").modal("hide");
    
              Swal.fire({
                title: 'Succés!!',
                text: "matiere modifié avec succés",
                icon: 'success'
              });
              $('#datatableexample').DataTable().destroy();   
              this.matiereService.getAllMatieres().subscribe(
    
                response => {
                  this.matieres = response;
    
                });
            });
          
          },
        (error: HttpErrorResponse) => { alert(error.message); }
      );



    }

  }

  //supprimer matiere___________________________________________________________

  deletedMatiere(matiere:Matiere) {
    $("#deleteMatiere").modal("show");
    this.deleteMatiere=matiere;
  }

public onDeleteMatiere(matiere_Id: any): void {

  this.matiereService.deleteMatiere(matiere_Id).subscribe(
    (response: void) => {
      console.log(response);
      $("#deleteMatiere").modal("hide");
      this.getMatieres();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

  }



}
