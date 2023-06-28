import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from 'src/app/models/module';
import { Contrainte } from 'src/app/models/contrainte';
import { Matiere } from 'src/app/models/matiere';
import { Niveau } from 'src/app/models/niveau';
import { ContrainteService } from 'src/app/services/contrainte.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { NiveauService } from 'src/app/services/niveau.service';
import Swal from 'sweetalert2';
import { ModuleService } from 'src/app/services/module.service';
declare let $: any;

@Component({
  selector: 'app-contrainte-list',
  templateUrl: './contrainte-list.component.html',
  styleUrls: ['./contrainte-list.component.css']
})
export class ContrainteListComponent implements OnInit {

  contraintes!: Contrainte[];

  matieresModule1!: Matiere[]; matieresModule2!: Matiere[];
  modules!: Module[];
  niveaux!: Niveau[];
  submitted = false;
  addForm!: FormGroup;
  public deleteContrainte !: Contrainte;

  constructor(private contrainteService: ContrainteService, private matiereService: MatiereService, private niveauService: NiveauService, private moduleService: ModuleService,

    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getContraintes();
    this.initForm();
    this.getNiveau();



  }
  public getContraintes(): void {

    this.contrainteService.getContraintes().subscribe(
      response => {
        this.contraintes = response;
        console.log(this.contraintes);

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  public getNiveau(): void {

    this.niveauService.getNiveaux().subscribe(
      response => {
        this.niveaux = response;
        console.log(this.niveaux);

      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }



  addContrainte() {
    $("#addContrainte").modal("show");

  }
  onChangeNiveau(niveau: Niveau) {

    if (niveau) {
      console.log(niveau);

      this.moduleService.getModulesByNiveau(niveau?.id_niv).subscribe(
        response => {
          this.modules = response;
          console.log(this.modules);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }

  }
  onChangeModule1(module: Module) {

    if (module) {
      console.log(module);

      this.matiereService.getMatieresByModule(module?.id_mod).subscribe(
        response => {
          this.matieresModule1 = response;
          console.log(this.matieresModule1);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }

  }
  onChangeModule2(module: Module) {

    if (module) {
      console.log(module);

      this.matiereService.getMatieresByModule(module?.id_mod).subscribe(
        response => {
          this.matieresModule2 = response;
          console.log(this.matieresModule2);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }

  }




  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");
    this.addForm.reset();


  }

  get addF() { return this.addForm.controls; }

  mustNotMatch(matiere1: any, matiere2: any) {
    return (formGroup: FormGroup) => {
      const matiere1Control = formGroup.controls[matiere1];
      const matiere2Control = formGroup.controls[matiere2];

      if (matiere2Control.errors && !matiere2Control.errors['mustNotMatch']) {
        return;
      }
      if (matiere1Control.value.nom_mat === matiere2Control.value.nom_mat) {
        matiere2Control.setErrors({ mustNotMatch: true })
      }
      else {
        matiere2Control.setErrors(null);
      }
    }

  }

  initForm() {

    this.addForm = this.formBuilder.group({
      niveau: new FormControl('', Validators.required),
      matiere1: new FormControl('', Validators.required),
      matiere2: new FormControl('', Validators.required),
      module1: new FormControl('', Validators.required),
      module2: new FormControl('', Validators.required),

    },
      {
        validators: this.mustNotMatch('matiere1', 'matiere2')
      }

    );

  }

  onAddContrainte() {
    this.submitted = true;
    if (this.addForm.invalid) { return; }
    if (this.submitted) {

      var newContrainte = new Contrainte();

      let list: Matiere[] = [];
     
      list.push(this.addForm.value.matiere1);
      list.push(this.addForm.value.matiere2);
      newContrainte.matieres = list;

if(this.contrainteService.existContrainte(this.contraintes,newContrainte)==false)
{ if(this.contrainteService.nbContrainte(this.contraintes,newContrainte.matieres[0])<2 && this.contrainteService.nbContrainte(this.contraintes,newContrainte.matieres[1])<2 )     
      { this.contrainteService.addContrainte(newContrainte).subscribe(
        response => { console.log(newContrainte); 
        

      this.contrainteService.getContraintes().subscribe(
        response => {
          this.contraintes = response;
          $("#addContrainte").modal("hide");

          Swal.fire({
            title: 'Succés!!',
            text: "Contrainte ajoutée avec succés",
            icon: 'success'
          });
          $('#datatableexample').DataTable().destroy();
          this.contrainteService.getContraintes().subscribe(

            response => {
              this.contraintes = response;

            });
        });
      
      },
        (error: HttpErrorResponse) => { alert(error.message); });
    }
    else if(this.contrainteService.nbContrainte(this.contraintes,newContrainte.matieres[0])>=2)
    {
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>La matière <b>'"+newContrainte.matieres[0].nom_mat +"</b>' a atteint le nombre limite de contraintes (Limite = 2).",
        icon: 'warning'
      });
    }
    else if(this.contrainteService.nbContrainte(this.contraintes,newContrainte.matieres[1])>=2)
    {
      Swal.fire({
        title: 'Erreur!!',
        html: "<br>La matière <b>'"+newContrainte.matieres[1].nom_mat +"'</b> a atteint le nombre limite de contraintes (Limite = 2).",
        icon: 'warning'
      });
    }
    }
    else {
      Swal.fire({
        title: 'Erreur!!',
        html: "Il existe deja une contrainte ayant les meme matieres ",
        icon: 'warning'
      });

    }

    }

  }


  deletedContrainte(contrainte: Contrainte) {
    $("#deleteContrainte").modal("show");
    this.deleteContrainte = contrainte;
  }

  public onDeleteContrainte(contrainte_Id: any): void {

    this.contrainteService.deleteContrainte(contrainte_Id).subscribe(
      (response: void) => {
        console.log(response);
        $("#deleteContrainte").modal("hide");
        this.getContraintes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }
}
