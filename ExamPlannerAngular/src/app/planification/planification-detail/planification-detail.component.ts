import { DatePipe, formatDate, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/app/models/examen';

import { Planification } from 'src/app/models/planification';
import { ExamenService } from 'src/app/services/examen.service';

import { PlanificationService } from 'src/app/services/planification.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-planification-detail',
  providers: [TitleCasePipe],
  templateUrl: './planification-detail.component.html',
  styleUrls: ['./planification-detail.component.css']
})
export class PlanificationDetailComponent implements OnInit {

  public planif!: Planification;
  public clicked = false;
  public loaded = false;
  public examens!: Examen[];
  submitted = false;
  editForm!: FormGroup;
  editVoeuxForm!: FormGroup;

  rest: any;



  constructor(
    private planificationService: PlanificationService,
    private route: ActivatedRoute, public examenService: ExamenService,
    private titlecasePipe: TitleCasePipe,
    private formBuilder: FormBuilder,

    private router: Router

  ) { }

  ngOnInit(): void {


    const planifId = +this.route.snapshot.params['id'];
    console.log("this" + planifId);

    this.planificationService.getPlanificationById(planifId).subscribe(
      response => {
        this.planif = response;
if(this.planif.date_debut_lancement_voeux!=null )
 { if(new Date(this.planif.date_debut_lancement_voeux)<=new Date() )
      { let x = setInterval(() => {
          var now = new Date().getTime();
          var distance = new Date(this.planif.date_fin_lancement_voeux).getTime() - now;
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var sec = Math.floor((distance % (1000 * 60)) / 1000);
          this.rest = "Deadline d'accepatation des voeux dans:  " + days + " jours " + hours + " heures " + min + " min " + sec + " s"
          if (distance < 0) {
            clearInterval(x);
            this.rest = "Deadline d'accepatation des voeux : expiré !"
          }

        })
      }
      else{this.rest = "Periode d'accepatation des voeux : du "+new Date(this.planif.date_debut_lancement_voeux).toLocaleDateString()  +" au "+ new Date(this.planif.date_fin_lancement_voeux).toLocaleDateString()+" ."

      }
    
    }

      else {this.rest = "Deadline d'accepatation des voeux : pas encore fixé!"}



      }

      , (error: HttpErrorResponse) => { alert(error.message); }

    )


    this.initForm();



  }
  get editF() { return this.editForm.controls; }
  get editVF() { return this.editVoeuxForm.controls; }

  initForm() {

    this.editForm = this.formBuilder.group(
      {
        type_session: ['', [Validators.required]],
        date_debut: ['', [Validators.required]],

        date_fin: ['', [Validators.required]],
        semestre: ['', [Validators.required,Validators.pattern("^[1-2]*$")]],
        nb_seance_jour: ['', [Validators.required,Validators.pattern("^[1-4]*$")]]

      }
    );
    this.editVoeuxForm = this.formBuilder.group(
      {
        date_debut_lancement_voeux: ['', [Validators.required]],

        date_fin_lancement_voeux: ['', [Validators.required]],

      }
    );



  }
  onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");


  }


  onModifier() {
    this.router.navigateByUrl(`planifications/${this.planif.id_planif}/*`);
    this.editForm.controls["type_session"].setValue(this.planif.type_session);

    this.editForm.controls["date_debut"].setValue(formatDate(this.planif.date_debut, 'yyyy-MM-dd', 'fr'));

    this.editForm.controls["date_fin"].setValue(formatDate(this.planif.date_fin, 'yyyy-MM-dd', 'fr'));
    this.editForm.controls["nb_seance_jour"].setValue(this.planif.nb_seance_jour);
    this.editForm.controls["semestre"].setValue(this.planif.semestre);


    $("#updatePlanification").modal("show");
  }

  onUpdatePlanification() {


    this.submitted = true;
    if (this.editForm.invalid) { return; }
    if (this.submitted) {
      var editPlanification = new Planification();
      editPlanification = this.planif;
      editPlanification.type_session = this.editForm.value.type_session;
      editPlanification.date_debut = this.editForm.value.date_debut;
      editPlanification.date_fin = this.editForm.value.date_fin;
      editPlanification.semestre = this.editForm.value.semestre;
      editPlanification.nb_seance_jour = this.editForm.value.nb_seance_jour;


      this.planificationService.updatePlanification(editPlanification).subscribe(
        response => {
          console.log(editPlanification);
          this.planificationService.getPlanificationById(this.planif.id_planif).subscribe(
            response => {
              this.planif = response;
              $("#updatePlanification").modal("hide");

              Swal.fire({
                title: 'Succés!!',
                text: "planification modifiée avec succés",
                icon: 'success'
              });
              this.router.navigateByUrl(`planifications/${this.planif.id_planif}`);

            });

        },
        (error: HttpErrorResponse) => { alert(error.message); }
      );



    }

  }






  public onPlanifier() {
    this.router.navigateByUrl(`planifications/${this.planif.id_planif}/*`);
    this.loaded = false;
    this.clicked = true;

    this.planificationService.lancerPlanification(this.planif).subscribe(
      response => {
        console.log("ok");
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );


    const progressBar = document.getElementById("bar");
    const loadingMsg = document.getElementById("loading");
    let barWidth = 0;
    if (loadingMsg)
      loadingMsg.innerHTML = `0% `;



    const animate = () => {
      barWidth++;
      if (progressBar)
        progressBar.style.width = `${barWidth}%`;

      if (loadingMsg)
        loadingMsg.innerHTML = `${barWidth}% `;

    };

    // animation starts 2 seconds after page load
    setTimeout(() => {
      let intervalID = setInterval(() => {
        if (barWidth === 100) {
          this.loaded = true;
          clearInterval(intervalID);

          this.examenService.getAllExamenByPlanification(this.planif?.id_planif).subscribe(
            response => {
              this.examens = response;
              console.log(this.examens)
              var dates: any = []
              for (let e of this.examens) {
                dates.push(new Date(e.date_exam))
              }
              var maximumDate = new Date(Math.max.apply(null, dates));
              console.log(maximumDate)
              if (this.examens.length == 0) {
                Swal.fire({
                  title: 'Désolé!!',
                  html: "<br>Aucun examen n'a ete programmé pour l'instant , veuillez consulter le service administratif pour plus d'information. ",
                  icon: 'error'
                });

              }

              else if (new Date(this.planif.date_fin).getTime() < maximumDate.getTime()) {
                const datepipe: DatePipe = new DatePipe('fr-FR')
                let string = datepipe.transform(maximumDate, 'EEEE dd MMMM yyyy');
                string = this.titlecasePipe.transform(string)
                Swal.fire({
                  title: 'Erreur!!',
                  html: "<br>Veuillez étendre la date fin de votre planification .<br>Date fin recommendée est le : <b>" + string + "</b>",
                  icon: 'error'
                });

              }
              else {

                this.router.navigateByUrl(`planifications/${this.planif.id_planif}/planifier/${this.planif.id_planif}`);
              }
            },
            (error: HttpErrorResponse) => { alert(error.message); });


        } else {
          animate();
        }
      }, 300); //this sets the speed of the animation
    }, 0);



  }


  public onParametrer() {
    this.clicked = false;
    this.router.navigateByUrl(`planifications/${this.planif.id_planif}/contraintes`);
  }

  public onAffecterVoeux() {
    this.router.navigateByUrl(`planifications/${this.planif.id_planif}`);
    this.router.navigateByUrl(`planifications/${this.planif.id_planif}/*`);
    if(new Date(this.planif.date_fin_lancement_voeux).getTime()-new Date().getTime()<0)

    {
    this.loaded = false;
    this.clicked = true;

    this.planificationService.affecterVoeux(this.planif).subscribe(
      response => {
        console.log(response);
        console.log("okVoeux");
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );


    const progressBar = document.getElementById("bar");
    const loadingMsg = document.getElementById("loading");
    let barWidth = 0;
    if (loadingMsg)
      loadingMsg.innerHTML = `0% `;



    const animate = () => {
      barWidth++;
      if (progressBar)
        progressBar.style.width = `${barWidth}%`;

      if (loadingMsg)
        loadingMsg.innerHTML = `${barWidth}% `;

    };

    // animation starts 2 seconds after page load
    setTimeout(() => {
      let intervalID = setInterval(() => {
        if (barWidth === 100) {
          this.loaded = true;
          clearInterval(intervalID);
          Swal.fire({
            title: 'Succées!!',
            html: "<br>Affectation des voeux avec succés !",
            icon: 'success'
          });
          this.router.navigateByUrl(`planifications/${this.planif.id_planif}`);




        } else {
          animate();
        }
      }, 600); //this sets the speed of the animation
    }, 0);

  }
  else{
    Swal.fire({
      title: 'Désolé !!',
      text: "la date d'acceptation des voeux n'est pas encore expiré , Veillez revenir ultérierement pour affecter les voeux aux retardataires",
      icon: 'error'
    });
  }

  }



  onModifierVoeux() {
    this.router.navigateByUrl(`planifications/${this.planif.id_planif}/*`);

    this.editVoeuxForm.controls["date_debut_lancement_voeux"].setValue(formatDate(this.planif.date_debut_lancement_voeux, 'yyyy-MM-ddThh:mm', 'fr'));

    this.editVoeuxForm.controls["date_fin_lancement_voeux"].setValue(formatDate(this.planif.date_fin_lancement_voeux, 'yyyy-MM-ddThh:mm', 'fr'));



    $("#updateVoeux").modal("show");
  }

  modifierVoeux() {


    console.log(this.editForm.value.date_fin_lancement_voeux);
    this.submitted = true;
    if (this.editVoeuxForm.invalid) { return; }
    if (this.submitted) {
      var editPlanification = new Planification();
      editPlanification = this.planif;

      if (document.getElementById("date_debut_lancement_voeux") != null && document.getElementById("date_fin_lancement_voeux") != null) {
        var x = document.getElementById("date_debut_lancement_voeux") as HTMLInputElement | null; console.log(x?.value);
        var y = document.getElementById("date_fin_lancement_voeux") as HTMLInputElement | null; console.log(y?.value);

        if (x && y) {
          editPlanification.date_debut_lancement_voeux = new Date(x.value);
          editPlanification.date_fin_lancement_voeux = new Date(y.value);
        }

        this.planificationService.updatePlanification(editPlanification).subscribe(
          response => {
            console.log(editPlanification);
            this.planificationService.getPlanificationById(this.planif.id_planif).subscribe(
              response => {
                this.planif = response;
                $("#updateVoeux").modal("hide");

                Swal.fire({
                  title: 'Succés!!',
                  text: "Periode d'acceptation des voeux modifiée avec succées",
                  icon: 'success'
                });
                this.router.navigateByUrl(`planifications/${this.planif.id_planif}`);

              });

          },
          (error: HttpErrorResponse) => { alert(error.message); }
        );



      }


    }



  }









}
