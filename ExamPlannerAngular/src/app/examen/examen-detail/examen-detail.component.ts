import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/app/models/examen';
import { ExamenSalle } from 'src/app/models/examen-salle';
import { Voeux } from 'src/app/models/voeux';
import { ExamenSalleService } from 'src/app/services/examen-salle.service';
import { ExamenService } from 'src/app/services/examen.service';
import { VoeuxService } from 'src/app/services/voeux.service';

@Component({
  selector: 'app-examen-detail',
  templateUrl: './examen-detail.component.html',
  styleUrls: ['./examen-detail.component.css']
})
export class ExamenDetailComponent implements OnInit {
 
  public exam!: Examen;
  public examensSalles!: ExamenSalle[];
  totalVoeux!: Voeux[]
  
  constructor(private examenService:ExamenService, private route: ActivatedRoute,
    private examen_salleService: ExamenSalleService,public voeuxService: VoeuxService,

    ) { }

  ngOnInit(): void {
    const examId = +this.route.snapshot.params['id'];
    console.log("this" + examId);

    this.examenService.getExamenById(examId).subscribe(
      response => {
        this.exam = response;
        console.log(this.exam)
      }

      , (error: HttpErrorResponse) => { alert(error.message); }

    )


    this.examen_salleService.getAllExamenSalles().subscribe(
      response => {
        let examensSalles = response;
        console.log(examensSalles);
        this.examensSalles=this.examen_salleService.getAllExamenSallesByExamen(examensSalles,this.exam);
        console.log(this.examensSalles)
     
     let exams=this.examen_salleService.getExamenSallesByDateSeancePlanif(examensSalles,this.exam.date_exam,this.exam.idSeance,this.exam.idPlanification);
     console.log(exams);
     
     this.voeuxService.getVoeux().subscribe(
      response => {
        this.totalVoeux = response;
        console.log(this.totalVoeux);
      },
      (error: HttpErrorResponse) => { alert(error.message); });
     
     
      }
      , (error: HttpErrorResponse) => { alert(error.message); }

      );
  


  }

}
