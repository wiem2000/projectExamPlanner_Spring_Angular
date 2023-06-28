import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { ExamenSalle } from 'src/app/models/examen-salle';
import { Planification } from 'src/app/models/planification';
import { Seance } from 'src/app/models/seance';
import { Voeux } from 'src/app/models/voeux';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExamenSalleService } from 'src/app/services/examen-salle.service';
import { PersonneService } from 'src/app/services/personne.service';
import { PlanificationService } from 'src/app/services/planification.service';
import { SeanceService } from 'src/app/services/seance.service';
import { VoeuxService } from 'src/app/services/voeux.service';

@Component({
  selector: 'app-convocation',
  templateUrl: './convocation.component.html',
  styleUrls: ['./convocation.component.css']
})
export class ConvocationComponent implements OnInit {

  planif!: Planification;
  user!: any;
  public dates: Date[] = [];
  public seances!: Seance[]; public seancesPlanif: Seance[] = [];
  public voeuxEns: Voeux[] = [];
  totalVoeux!: Voeux[]
 
 
 
  totalExamSalle!: ExamenSalle[];
  rest:any;



  constructor(private planificationService: PlanificationService, private route: ActivatedRoute, private seanceService: SeanceService,
    private authenticationService: AuthenticationService, private personneService: PersonneService, public voeuxService: VoeuxService,
    private examen_salleService: ExamenSalleService, private router:Router) { }

  ngOnInit(): void {

    const planifId = +this.route.snapshot.params['id'];
    console.log("this" + planifId);

    this.planificationService.getPlanificationById(planifId).subscribe(
      response => {
        this.planif = response;
        console.log(this.planif)
        for (let date = new Date(this.planif?.date_debut); date <= new Date(this.planif?.date_fin); date.setDate(date.getDate() + 1)) {
          this.dates.push(new Date(date));
        }

        this.seanceService.getSeances().subscribe(
          response => {
            this.seances = response;
            for (let i = 0; i < this.planif.nb_seance_jour; i++) this.seancesPlanif.push(this.seances[i]);


            this.getPersonnes();

          },
          (error: HttpErrorResponse) => { alert(error.message); });

       

      }
      , (error: HttpErrorResponse) => { alert(error.message); }

    )




  }

    
  public getPersonnes(): void {

    this.personneService.getPersonnes().subscribe(
      response => {
        let personnes = response;
        this.user = this.authenticationService.getUserLoggedIn(personnes)

        this.voeuxService.getVoeuxByEnseignant(this.user?.id_pers).subscribe(
          response => {
            let voeux = response;
            console.log(voeux);

            this.voeuxEns = this.voeuxService.getVoeuxByEnseignantByPlanif(voeux, this.planif)
            console.log(this.voeuxEns)
              

            this.voeuxService.getVoeux().subscribe(
              response => {
                this.totalVoeux = response;
                

                this.examen_salleService.getAllExamenSalles().subscribe(
                  response => {
                    this.totalExamSalle = response;



                  },
                  (error: HttpErrorResponse) => { alert(error.message); });

              },
              (error: HttpErrorResponse) => { alert(error.message); });



          },
          (error: HttpErrorResponse) => { alert(error.message); });


      },
      (error: HttpErrorResponse) => { alert(error.message); });


  }

  public getCode(x: Date, s: Seance): string {
    return new Date(x).toLocaleDateString() + s.num_seance.toString();
  }

  downloadPDF() {

   
    const datepipe: DatePipe = new DatePipe('fr-FR')
    let string = datepipe.transform(this.planif.date_debut, 'MMMM yyyy');

    var doc = new jspdf('p', 'mm','a4');
    doc.setFontSize(13);
    doc.text(" Université de Tunis ", 20, 20);
    doc.text("Le Directeur ", 150, 220);
    
  
   
    var element = document.getElementById('convocation');
    if (element)



      html2canvas(element).then((canvas) => {
        var img = canvas.toDataURL('image/png');
        var imgWidth = 190;

        var imgHeight = canvas.height * imgWidth / canvas.width;


        doc.addImage(img, 'PNG', 10, 70, imgWidth, imgHeight);
        doc.addPage();

    

        doc.save("convovation "+this.planif.type_session + "_" + string + '.pdf')
      })
  }

}
