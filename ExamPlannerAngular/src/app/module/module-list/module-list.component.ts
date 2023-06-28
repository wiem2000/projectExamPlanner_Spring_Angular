import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from 'src/app/models/module';

import { Niveau } from 'src/app/models/niveau';
import { Parcours } from 'src/app/models/parcours';
import { ModuleService } from 'src/app/services/module.service';
import { NiveauService } from 'src/app/services/niveau.service';
import { ParcoursService } from 'src/app/services/parcours.service';
import Swal from 'sweetalert2';
declare let $: any;


@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit {

  parcours!: Parcours[];

  niveaux!: Niveau[];

  modules!: Module[];
  addForm!: FormGroup;
  editForm!: FormGroup;
  public deleteModule !: Module;
  public updateModule!: Module;
  submitted = false;

  constructor(private moduleService: ModuleService,
    private niveauService: NiveauService,
    private parcoursService: ParcoursService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.initForm();
    this.getModules();
    this.setDefault();
    this.getParcours();
  }

  public getModules(): void {

    this.moduleService.getAllModules().subscribe(
      response => {
        this.modules = response;
        console.log(this.modules);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }
  public getParcours(): void {

    this.parcoursService.getParcours().subscribe(
      response => {
        this.parcours = response;
        console.log(this.parcours);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }

  setDefault() {


    this.addForm.get("idParcours")?.patchValue(null);
    this.addForm.get("idNiveau")?.patchValue(null);

  }
  onChangeParcours(id_par: number) {


    if (id_par != undefined) {


      this.niveauService.getNiveauByParcours(id_par).subscribe(
        response => {
          this.niveaux = response;
          console.log(this.niveaux);

        },
        (error: HttpErrorResponse) => { alert(error.message); }

      )
    }
  }
  // etat module_______________________________________________________________________


  checkEtat(module: Module) {

    let checkBox = document.getElementById("flexSwitchCheckChecked" + module.id_mod) as HTMLInputElement | null;

    var editModule = module;
    let etat: string

    if (checkBox?.checked) {


      editModule.etat_mod = true;
      etat = "activé"
    }
    else {
      editModule.etat_mod = false;
      etat = "désactivé"
    }
    this.moduleService.updateModule(editModule).subscribe(
      response => {
        console.log(editModule);

        this.moduleService.getAllModules().subscribe(
          response => {
            this.modules = response;
            Swal.fire({
              title: 'Succés!!',
              text: "vous avez " + etat + " le module " + module.nom_mod,
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();
            this.moduleService.getAllModules().subscribe(

              response => {
                this.modules = response;

              });
          });


      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );

  }
  //chercher module _______________________________________________________________

  public chercherModules(key: string): void {
    console.log(key);
    const results: Module[] = [];
    for (const module of this.modules) {
      if (module.nom_mod.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1

        || module.idNiveau.nom_niv.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
        || module.id_mod.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(module);
      }
    }
    this.modules = results;
    if (results.length === 0 || !key) {
      this.getModules();
    }
  }



  initForm() {
    this.addForm = this.formBuilder.group(
      {
        nom_mod: ['', [Validators.required]],
        semestre: ['', [Validators.required,Validators.pattern("^[1-2]*$")]],

        idNiveau: ['', [Validators.required]],
        idParcours: ['', [Validators.required]],
        etat_mod: ['']
      }
    );
    this.editForm = this.formBuilder.group(
      {
        nom_mod: ['', [Validators.required]],
        semestre: ['', [Validators.required,Validators.pattern("^[1-2]*$")]],
        idNiveau: ['', [Validators.required]],
        idParcours: ['', [Validators.required]],

        etat_mod: ['']
      }
    );

  }
  //ajouter_____________________________________________________________________

  addModule() {
    $("#addModule").modal("show");
  }
  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");

  }

  get addF() { return this.addForm.controls; }

  onAddModule() {
    console.log(this.addForm.value.idNiveau)
    this.submitted = true;
    if (this.addForm.invalid) { return; }
    if (this.submitted) {

      let checkBoxActive = document.getElementById("etat_modActive") as HTMLInputElement | null;


      var newModule: Module = new Module();

      newModule.nom_mod = this.addForm.value.nom_mod;
      newModule.semestre = this.addForm.value.semestre;

      if (checkBoxActive?.checked) {
        newModule.etat_mod = true;
      } else newModule.etat_mod = false

      newModule.idNiveau = this.addForm.value.idNiveau;


      if (this.moduleService.existeModule(this.modules, newModule) == false) {

        this.moduleService.addModule(newModule).subscribe(
          response => {
            console.log(newModule);

            this.moduleService.getAllModules().subscribe(
              response => {
                this.modules = response;
                $("#addModule").modal("hide");

                Swal.fire({
                  title: 'Succés!!',
                  text: "module ajouté avec succés",
                  icon: 'success'
                });
                $('#datatableexample').DataTable().destroy();
                this.moduleService.getAllModules().subscribe(

                  response => {
                    this.modules = response;

                  });
              });

          },
          (error: HttpErrorResponse) => { alert(error.message); }
        );

      }
      else {
        Swal.fire({
          title: 'Erreur!!',
          html: "<br>Un module portant le nom <b>'" + newModule.nom_mod + "'</b> ayant le niveau <b>" + newModule.idNiveau.nom_niv + "</b> existe déja . ",
          icon: 'warning'
        });

      }

    }

  }

  //editModule___________________________________________________________________



  editModule(module: Module) {

    this.updateModule = module;
    this.onChangeParcours(module?.idNiveau?.idParcours.id_par);



    this.editForm.controls["nom_mod"].setValue(module.nom_mod);
    this.editForm.controls["semestre"].setValue(module.semestre);



    if (module.idNiveau) this.editForm.get("idNiveau")?.patchValue(this.updateModule?.idNiveau?.id_niv);
    else this.editForm.get("idNiveau")?.patchValue(null);

    if (module.idNiveau.idParcours) this.editForm.get("idParcours")?.patchValue(this.updateModule?.idNiveau?.idParcours?.id_par);
    else this.editForm.get("idParcours")?.patchValue(null);

    $("#editModule").modal("show");
  }

  get editF() { return this.editForm.controls; }

  onEditModule() {
    this.submitted = true;
    if (this.editForm.invalid) { return; }
    if (this.submitted) {
      let checkBoxActive = document.getElementById("etat_modActiveEdit") as HTMLInputElement | null;

      let listeModule: Module[] = [];
      for (let m of this.modules) { listeModule.push(m); }
      let newN: Module = new Module();
      newN.nom_mod = this.editForm.value.nom_mod;
      let niveau = new Niveau(); 
      niveau.id_niv=this.editForm.value.idNiveau;

      newN.idNiveau = niveau;

      let index = listeModule.findIndex(x => x.id_mod == this.updateModule.id_mod)
      listeModule.splice(index, 1);

      if (this.moduleService.existeModule(listeModule, newN) == false) {

        var editModule = this.updateModule;
        editModule.nom_mod = this.editForm.value.nom_mod;
        editModule.semestre = this.editForm.value.semestre;
        editModule.idNiveau.id_niv = this.editForm.value.idNiveau;

        if (checkBoxActive?.checked) {
          editModule.etat_mod = true;
        } else editModule.etat_mod = false


        this.moduleService.updateModule(editModule).subscribe(
          response => {
            console.log(editModule);
            this.moduleService.getAllModules().subscribe(
              response => {
                this.modules = response;
                $("#editModule").modal("hide");

                Swal.fire({
                  title: 'Succés!!',
                  text: "module modifié avec succés",
                  icon: 'success'
                });
                $('#datatableexample').DataTable().destroy();
                this.moduleService.getAllModules().subscribe(

                  response => {
                    this.modules = response;

                  });
              });

          },
          (error: HttpErrorResponse) => { alert(error.message); }
        );

      }
      else {
        Swal.fire({
          title: 'Erreur!!',
          html: "<br>Un module portant le nom <b>'" + newN.nom_mod + "'</b> ayant le meme niveau existe déja . ",
          icon: 'warning'
        });

      }


    }

  }

  //supprimer module___________________________________________________________

  deletedModule(module: Module) {
    $("#deleteModule").modal("show");
    this.deleteModule = module;
  }

  public onDeleteModule(module_Id: any): void {

    this.moduleService.deleteModule(module_Id).subscribe(
      (response: void) => {
        console.log(response);
        $("#deleteModule").modal("hide");
        this.getModules();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }



}
