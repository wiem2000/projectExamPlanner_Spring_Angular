import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parcours } from 'src/app/models/parcours';
import { ParcoursService } from 'src/app/services/parcours.service';
import Swal from 'sweetalert2';
declare let $: any;


@Component({
  selector: 'app-parcours-list',
  templateUrl: './parcours-list.component.html',
  styleUrls: ['./parcours-list.component.css']
})
export class ParcoursListComponent implements OnInit {

  parcours!: Parcours[];

  addForm!: FormGroup;
  editForm!: FormGroup;
  public deleteParcours !: Parcours;
  public updateParcours!: Parcours;
  submitted = false;

  constructor(

    private parcoursService: ParcoursService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.initForm();


    this.getParcours();
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


  // etat parcours_______________________________________________________________________

  checkEtat(parcours: Parcours) {

    let checkBox = document.getElementById("flexSwitchCheckChecked" + parcours.id_par) as HTMLInputElement | null;

    var editParcours = parcours;
    let etat: string

    if (checkBox?.checked) {


      editParcours.etat_par = true;
      etat = "activé"
    }
    else {
      editParcours.etat_par = false;
      etat = "désactivé"
    }
    this.parcoursService.updateParcours(editParcours).subscribe(
      response => {
        console.log(editParcours);

        this.parcoursService.getParcours().subscribe(
          response => {
            this.parcours = response;
            Swal.fire({
              title: 'Succés!!',
              text: "vous avez " + etat + " le parcours " + parcours.nom_par,
              icon: 'success'
            });
            $('#datatableexample').DataTable().destroy();
            this.parcoursService.getParcours().subscribe(

              response => {
                this.parcours = response;

              });
          });


      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );

  }
  //chercher parcours _______________________________________________________________

  public chercherParcours(key: string): void {
    console.log(key);
    const results: Parcours[] = [];
    for (const parcours of this.parcours) {
      if (parcours.nom_par.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1


        || parcours.id_par.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(parcours);
      }
    }
    this.parcours = results;
    if (results.length === 0 || !key) {
      this.getParcours();
    }
  }



  initForm() {
    this.addForm = this.formBuilder.group(
      {
        nom_par: ['', [Validators.required]],


        etat_par: ['']
      }
    );
    this.editForm = this.formBuilder.group(
      {
        nom_par: ['', [Validators.required]],


        etat_par: ['']
      }
    );

  }
  //ajouter_____________________________________________________________________

  addParcours() {
    $("#addParcours").modal("show");
  }
  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");

  }

  get addF() { return this.addForm.controls; }

  onAddParcours() {
    console.log(this.addForm.value.idParcours)
    this.submitted = true;
    if (this.addForm.invalid) { return; }
    if (this.submitted) {

      let checkBoxActive = document.getElementById("etat_parActive") as HTMLInputElement | null;


      var newParcours: Parcours = new Parcours();

      newParcours.nom_par = this.addForm.value.nom_par;


      if (checkBoxActive?.checked) {
        newParcours.etat_par = true;
      } else newParcours.etat_par = false

      if (this.parcoursService.existeParcours(this.parcours, newParcours) == false) {
        this.parcoursService.addParcours(newParcours).subscribe(
          response => {
            console.log(newParcours);

            this.parcoursService.getParcours().subscribe(
              response => {
                this.parcours = response;
                $("#addParcours").modal("hide");

                Swal.fire({
                  title: 'Succés!!',
                  text: "parcours ajouté avec succés",
                  icon: 'success'
                });
                $('#datatableexample').DataTable().destroy();
                this.parcoursService.getParcours().subscribe(

                  response => {
                    this.parcours = response;

                  });
              });

          },
          (error: HttpErrorResponse) => { alert(error.message); }
        );

      }
      else {
        Swal.fire({
          title: 'Erreur!!',
          html: "<br>Le parcours <b>'" + newParcours.nom_par + "'</b>  existe déja. ",
          icon: 'warning'
        });

      }

    }

  }

  //editParcours___________________________________________________________________



  editParcours(parcours: Parcours) {

    this.updateParcours = parcours;




    this.editForm.controls["nom_par"].setValue(parcours.nom_par);




    $("#editParcours").modal("show");
  }

  get editF() { return this.editForm.controls; }

  onEditParcours() {
    this.submitted = true;
    if (this.editForm.invalid) { return; }
    if (this.submitted) {
      let checkBoxActive = document.getElementById("etat_parActiveEdit") as HTMLInputElement | null;

      let listeParcours: Parcours[] = [];
      for (let p of this.parcours) { listeParcours.push(p); }
      let newP:Parcours=new Parcours(); newP.nom_par=this.editForm.value.nom_par;
      
      let index = listeParcours.findIndex(x => x.id_par == this.updateParcours.id_par)
      listeParcours.splice(index, 1);

      if (this.parcoursService.existeParcours(listeParcours, newP) == false) {


      var editParcours = new Parcours();
      editParcours =this.updateParcours;
      editParcours.nom_par = this.editForm.value.nom_par;

      if (checkBoxActive?.checked) {
        editParcours.etat_par = true;
      } else editParcours.etat_par = false


      
        console.log(false)
        this.parcoursService.updateParcours(editParcours).subscribe(
          response => {
            console.log(editParcours);
            this.parcoursService.getParcours().subscribe(
              response => {
                this.parcours = response;
                $("#editParcours").modal("hide");

                Swal.fire({
                  title: 'Succés!!',
                  text: "parcours modifié avec succés",
                  icon: 'success'
                });
                $('#datatableexample').DataTable().destroy();
                this.parcoursService.getParcours().subscribe(

                  response => {
                    this.parcours = response;

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
          html: "<br>Le parcours <b>'" + newP.nom_par + "'</b>  existe déja. ",
          icon: 'warning'
        });

      }



    }

  }

  //supprimer parcours___________________________________________________________

  deletedParcours(parcours: Parcours) {
    $("#deleteParcours").modal("show");
    this.deleteParcours = parcours;
  }

  public onDeleteParcours(parcours_Id: any): void {

    this.parcoursService.deleteParcours(parcours_Id).subscribe(
      (response: void) => {
        console.log(response);
        $("#deleteParcours").modal("hide");
        this.getParcours();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }


}
