import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { Examen } from 'src/app/models/examen';
import { ExamenSalle } from 'src/app/models/examen-salle';
import { Matiere } from 'src/app/models/matiere';
import { Module } from 'src/app/models/module';
import { Niveau } from 'src/app/models/niveau';
import { Parcours } from 'src/app/models/parcours';
import { Planification } from 'src/app/models/planification';
import { Salle } from 'src/app/models/salle';
import { Seance } from 'src/app/models/seance';
import { ExamenSalleService } from 'src/app/services/examen-salle.service';
import { ExamenService } from 'src/app/services/examen.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { ModuleService } from 'src/app/services/module.service';
import { NiveauService } from 'src/app/services/niveau.service';
import { ParcoursService } from 'src/app/services/parcours.service';
import { PlanificationService } from 'src/app/services/planification.service';
import { SalleService } from 'src/app/services/salle.service';
import { SeanceService } from 'src/app/services/seance.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx"

declare let $: any;

@Component({
  selector: 'app-planification-tableau',
  templateUrl: './planification-tableau.component.html',
  styleUrls: ['./planification-tableau.component.css']
})
export class PlanificationTableauComponent implements OnInit {
  public planif!: Planification;
  public dates: Date[] = [];
  public salles!: Salle[];

  public matieres!: Matiere[];
  public parcours!: Parcours[];

  public niveaux!: Niveau[];
  public seances!: Seance[]; public seancesPlanif: Seance[] = [];
  public examens!: Examen[];
  public examensSalles!: ExamenSalle[];
  public capacite!: number;





  constructor(private planificationService: PlanificationService,
    private route: ActivatedRoute,
    private parcoursService: ParcoursService,
    public niveauService: NiveauService,
    private seanceService: SeanceService,
    public examen_salleService: ExamenSalleService,
    public salleService: SalleService,
    public router: Router,

    public examenService: ExamenService) { }

  ngOnInit(): void {
    const planifId = +this.route.snapshot.params['id'];


    this.planificationService.getPlanificationById(planifId).subscribe(
      response => {
        this.planif = response;
        for (let date = new Date(this.planif?.date_debut); date <= new Date(this.planif?.date_fin); date.setDate(date.getDate() + 1)) {
          this.dates.push(new Date(date));

        }
        this.getTableau();

      }

      , (error: HttpErrorResponse) => { alert(error.message); }

    )



  }

  onDetailExam(examen: Examen) {
    this.router.navigateByUrl(`list_exam/${examen.id_exam}`)
  }




  public getTableau(): void {

    console.log(this.planif)
    this.parcoursService.getParcoursActive().subscribe(
      response => {
        this.parcours = response;

        console.log(this.parcours)
        console.log(this.parcours[0])
        this.examenService.getAllExamenByPlanification(this.planif?.id_planif).subscribe(
          response => {
            this.examens = response;
            console.log(this.examens);
            if (this.examens.length == 0) {
              Swal.fire({
                title: 'Désolé!!',
                text: "Aucun examen n'à été programé pour l'instant , Veuillez réessayer ultérieurement. ",
                icon: 'error'
              });
            }

            this.niveauService.getNiveauxActive().subscribe(
              response => {
                this.niveaux = response;
                console.log(this.niveaux);

                console.log(this.niveauService.getNiveauByParcours1(this.parcours[0], this.niveaux))

                this.seanceService.getSeances().subscribe(
                  response => {
                    this.seances = response;
                    for (let i = 0; i < this.planif.nb_seance_jour; i++) this.seancesPlanif.push(this.seances[i]);
                    console.log(this.seances);
                    console.log(this.seancesPlanif);
                    console.log(this.dates);

                    this.examen_salleService.getAllExamenSalles().subscribe(
                      response => {
                        this.examensSalles = response;
                        console.log(this.examensSalles);
                        console.log(this.examen_salleService.getAllExamenSallesByExamen(this.examensSalles, this.examens[0]));

                        this.salleService.getSalles().subscribe(
                          response => {
                            this.salles = response;
                            console.log(this.salles);
                            this.capacite = this.salleService.getCapaciteTotal(this.salles)








                            //---------------------------------
                          },
                          (error: HttpErrorResponse) => { alert(error.message); });

                      },
                      (error: HttpErrorResponse) => { alert(error.message); });

                  },
                  (error: HttpErrorResponse) => { alert(error.message); });




              },
              (error: HttpErrorResponse) => { alert(error.message); });



          },
          (error: HttpErrorResponse) => { alert(error.message); });
      },
      (error: HttpErrorResponse) => { alert(error.message); });


  }

  onExportExcel() {
    const table = document.getElementById('table1');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    ws['!cols'] = [];
    ws['!rows'] = [];

    ws['!cols'] = [
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },
      { 'width': 30 },



    ]; // hidding col C

    ws['!rows'] = [
      { 'hpt': 30, },
      { 'hpt': 30 },
      { 'hpt': 30, },
      { 'hpt': 30 },
      { 'hpt': 30, },
      { 'hpt': 30 },
      { 'hpt': 30, },
      { 'hpt': 30 },
      { 'hpt': 30, },
      { 'hpt': 30 },

    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    const datepipe: DatePipe = new DatePipe('fr-FR')
    let string = datepipe.transform(this.planif.date_debut, 'MMMM yyyy');

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, this.planif.type_session + "_" + string + ".xlsx");
  }


  public onDismiss(idModal: any) {
    $("#" + idModal).modal("hide");

  }

  public validePlanif() {

    $('#validePlanif').modal('show');
    console.log($('#validePlanif'));

  }

  

  public onValidePlanif() {


    var planif = new Planification();
    planif = this.planif;

    this.planificationService.getPlanificatins().subscribe(
      response => {
        let planifications = response;
        let listPlanificationValide=this.planificationService.getPlanificationValide(planifications);
  
    if(this.planificationService.existsPlanif(listPlanificationValide,planif)==false)
   {

    planif.valide = true;

    this.planificationService.updatePlanification(planif).subscribe(
      response => {
        console.log(this.planif);
        $("#validePlanif").modal("hide");
        Swal.fire({
          title: 'Succés!!',
          text: "Planification validée avec succés",
          icon: 'success'
        });

        this.router.navigate([`planifications/${planif.id_planif}`]);

      },
      (error: HttpErrorResponse) => { alert(error.message); });
    }
    else{
      $("#validePlanif").modal("hide");
      Swal.fire({
        title: 'Erreur!!',
        html: "Il existe déja une planification validée au cours de cette periode.<br> Veuillez procéder par l'une des solutions suivantes: <br><br>  "
       + "<b>1.</b> Supprimer la planification existante. <br><b>2.</b> Modifier les parametres de cette planification.",
        icon: 'warning'
      });

    }


  },
  (error: HttpErrorResponse) => { alert(error.message); })


  }

  downloadPDF() {

    const datepipe: DatePipe = new DatePipe('fr-FR')
    let string = datepipe.transform(this.planif.date_debut, 'MMMM yyyy');
    let semestre;

    var doc = new jspdf('l', 'mm','a4');

      doc.setFontSize(13);
      doc.text(" Université de Tunis ", 20, 20);
      doc.text("Le Directeur ", 250, 180);
      doc.setFontSize(20);
      if(this.planif?.semestre==1) semestre=" 1 er "; else semestre=" 2 ème "
     doc.text(" Calendrier Des examens du" +semestre+"semestre" ,90, 50);
      doc.text(" Session " + this.planif?.type_session + " " + string , 110, 60)
      doc.setFontSize(9);
      doc.text(" NB:  Le symbole * indique un examen d'une heure ", 20, 150);
      doc.text(" Les cases colorées en orange indique un examen pratique qui dure 1h 15mn y compris le temps d’enregistrement des travaux. ", 20, 155);


      var width = doc.internal.pageSize.getWidth(); console.log(width)
    var height = doc.internal.pageSize.getHeight(); console.log(height)


     var element = document.getElementById('table1');
    if (element)



      html2canvas(element).then((canvas) => {
        var img = canvas.toDataURL('image/png');
        var imgWidth = 280;

        var imgHeight = canvas.height * imgWidth / canvas.width;


        doc.addImage(img, 'PNG', 10, 70, imgWidth, imgHeight);
        doc.addPage();

    

        doc.save(this.planif.type_session + "_" + string + '.pdf')
      })
 
}










}
