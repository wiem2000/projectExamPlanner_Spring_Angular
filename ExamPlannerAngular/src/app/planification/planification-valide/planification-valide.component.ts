import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { Examen } from 'src/app/models/examen';
import { ExamenSalle } from 'src/app/models/examen-salle';
import { Matiere } from 'src/app/models/matiere';
import { Niveau } from 'src/app/models/niveau';
import { Parcours } from 'src/app/models/parcours';
import { Planification } from 'src/app/models/planification';
import { Salle } from 'src/app/models/salle';
import { Seance } from 'src/app/models/seance';
import { ExamenSalleService } from 'src/app/services/examen-salle.service';
import { ExamenService } from 'src/app/services/examen.service';
import { NiveauService } from 'src/app/services/niveau.service';
import { ParcoursService } from 'src/app/services/parcours.service';
import { PlanificationService } from 'src/app/services/planification.service';
import { SalleService } from 'src/app/services/salle.service';
import { SeanceService } from 'src/app/services/seance.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-planification-valide',
  templateUrl: './planification-valide.component.html',
  styleUrls: ['./planification-valide.component.css']
})
export class PlanificationValideComponent implements OnInit {

  public planif!: Planification;
  public dates: Date[] = [];
  public salles!: Salle[];

  
  public parcours: Parcours[]=[];

  public niveaux: Niveau[]=[];
  public seances!: Seance[]; public seancesPlanif: Seance[] = [];
  public examens!: Examen[];
  public examensSalles!: ExamenSalle[];
  public capacite!: number;





  constructor(private planificationService: PlanificationService,
    private route: ActivatedRoute,
  public niveauService:NiveauService,
  public parcoursService:ParcoursService,
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

        this.examenService.getAllExamenByPlanification(this.planif?.id_planif).subscribe(
          response => {
            this.examens = response;
            console.log(this.examens);

            for(let exam of this.examens){
             let niveau:Niveau=new Niveau();
             let parcours:Parcours=new Parcours();
             parcours=exam.idMatiere.idModule.idNiveau.idParcours;
             niveau=exam.idMatiere.idModule.idNiveau;
             if(this.parcoursService.existeParcours(this.parcours,parcours)==false)
             {
               this.parcours.push(parcours);
             }
             if(this.niveauService.existeNiveau(this.niveaux,niveau)==false)
             {
               this.niveaux.push(niveau);
             }
            }

      

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
 


  }



  
  downloadPDF1() {

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

public getCode(n:Niveau): string {
  return "niveau"+n.id_niv.toString();
}

downloadPDF2() {

  
     

let semestre:string;
const datepipe: DatePipe = new DatePipe('fr-FR')
let string = datepipe.transform(this.planif.date_debut, 'MMMM yyyy');
  var doc = new jspdf('p', 'mm');
  doc.setFontSize(13);
  doc.text(" Université de Tunis ", 10, 20);
  doc.text("Le Directeur ", 160, 270);
  doc.setFontSize(18);
  if(this.planif?.semestre==1) semestre=" 1 er "; else semestre=" 2 ème "
 doc.text("Calendrier des Examens du " +semestre+"semestre" ,50, 40);
 doc.text("Affectation des salles - Année Universitaire " +(new Date(this.planif.date_debut).getFullYear()-1).toString()+"/"+(new Date(this.planif.date_debut).getFullYear()).toString() ,30, 50);
 doc.setFontSize(15);
 doc.text(" Session " + this.planif?.type_session + " " + string , 70, 60);


 
  var element = document.getElementById('table2');
  if (element)


  html2canvas(element).then(function (canvas) {

    var imgWidth = 190;
    var pageHeight = 200;
    var imgHeight = (canvas.height * imgWidth / canvas.width )-50;
    var heightLeft = imgHeight;


    



    var position = 80;
    var pageData = canvas.toDataURL('image/jpeg', 1.0);
    var imgData = encodeURIComponent(pageData);
    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    doc.setLineWidth(5);
    doc.setDrawColor(255, 255, 255);
    doc.rect(0, 0, 210, 295);
    heightLeft =heightLeft- pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
     
      doc.addPage();
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      doc.setLineWidth(5);
      doc.text("Le Directeur ", 160, 250);
      doc.rect(0, 0, 210, 295);
      heightLeft -= pageHeight;
    }
    doc.save('file.pdf');

  });



   
  
}



async downloadPDF4() {
  let semestre:string;
  const datepipe: DatePipe = new DatePipe('fr-FR')
  let string = datepipe.transform(this.planif.date_debut, 'MMMM yyyy');
  const doc = new jspdf('p', 'mm', 'a4');
  const options = {
    pagesplit: true
  };


  for (let n of this.niveaux) {
    doc.setFontSize(13);
    doc.text(" Université de Tunis ", 10, 20);
    doc.text("Le Directeur ", 160, 270);
    doc.setFontSize(18);
    if(this.planif?.semestre==1) semestre=" 1 er "; else semestre=" 2 ème "
   doc.text("Calendrier des Examens du " +semestre+"semestre" ,55, 40);
   doc.text("Année Universitaire " +(new Date(this.planif.date_debut).getFullYear()-1).toString()+"/"+(new Date(this.planif.date_debut).getFullYear()).toString() ,65, 50);
   doc.setFontSize(15);
   doc.text(" Session " + this.planif?.type_session + " " + string , 70, 60);
  
    var element = document.getElementById('niveau'+n.id_niv.toString());
    // excute this function then exit loop
    if(element)
    await html2canvas(element, { scale: 1 }).then(function (canvas) { 
      var imgWidth = 190;

      var imgHeight = canvas.height * imgWidth / canvas.width;
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10,80, imgWidth, imgHeight);
      
        doc.addPage();
      
    });
  }
  // download the pdf with all charts
  doc.save(this.planif.type_session + "_" + string + '.pdf');
}

scrollToElement($element:any): void {
  console.log($element);
  $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}

}
