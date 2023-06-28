import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Planification } from 'src/app/models/planification';
import { PlanificationService } from 'src/app/services/planification.service';

@Component({
  selector: 'app-planifications',
  templateUrl: './planifications.component.html',
  styleUrls: ['./planifications.component.css']
})
export class PlanificationsComponent implements OnInit {

  public planif!: Planification;

  constructor(  private planificationService: PlanificationService,
    private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    const planifId = +this.route.snapshot.params['id'];
    console.log("this" + planifId);

    this.planificationService.getPlanificationById(planifId).subscribe(
      response => {
        this.planif = response;}

        , (error: HttpErrorResponse) => { alert(error.message); }
  
      )
  
  }

  getConv(){
    this.router.navigate([`mesVoeux/convocation/${this.planif.id_planif}`]);
  }
addVoeux(){
  this.router.navigate([`mesVoeux/add_voeux/${this.planif.id_planif}`]);
}
}
