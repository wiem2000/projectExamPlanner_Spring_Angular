import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Planification } from 'src/app/models/planification';
import { Voeux } from 'src/app/models/voeux';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PersonneService } from 'src/app/services/personne.service';
import { PlanificationService } from 'src/app/services/planification.service';
import { VoeuxService } from 'src/app/services/voeux.service';
declare let $: any;

@Component({
  selector: 'app-voeux-enseignant',
  templateUrl: './voeux-enseignant.component.html',
  styleUrls: ['./voeux-enseignant.component.css']
})
export class VoeuxEnseignantComponent implements OnInit {

  voeux!:Voeux[];
  user!: any;
  addForm!:FormGroup;
  submitted=false;
  planifications!:Planification[];

  
  constructor(
    
  private voeuxService:VoeuxService, private authenticationService: AuthenticationService, private personneService: PersonneService, 
  private formBuilder: FormBuilder,private router: Router,private planificationService: PlanificationService) { }

  ngOnInit(): void {
    this.initForm();
    this.setDefault();
    
   
  
  
    this.getVoeux();
  }
  setDefault(){
    this.addForm.get("planif")?.patchValue(null);
  }
  public getVoeux(): void {


    this.personneService.getPersonnes().subscribe(
      response => {
        let personnes = response;
        this.user = this.authenticationService.getUserLoggedIn(personnes)

    this.voeuxService.getVoeuxByEnseignant(this.user?.id_pers).subscribe(
      response => {
        this.voeux= response;
        console.log(this.voeux);
       

          this.planificationService.getPlanificatins().subscribe(
            response => {
              this.planifications = response;
            },
            (error: HttpErrorResponse) => { alert(error.message); }
          )
      
        

      },
      (error: HttpErrorResponse) => { alert(error.message); });
    },
    (error: HttpErrorResponse) => { alert(error.message); });


  }

  //ajouter voeux_____________________________________________________________________
  initForm(){
    this.addForm=this.formBuilder.group(
      {planif:['',[Validators.required]],
      
    
      }
    );
  }

  addVoeux() {
    $("#addVoeux").modal("show");
  }
  onDismiss(idModal:any)
  {
    $("#"+idModal).modal("hide");

  }

  get addF() { return this.addForm.controls; }
  
  onAddVoeux() {
    
    this.submitted = true;
    if(this.addForm.invalid){return;}
    if (this.submitted) {

     
      let planif=this.addForm.value.planif;
     
      this.router.navigate([`mesVoeux/add_voeux/${planif.id_planif}`]);
       $("#addVoeux").modal("hide");
    }

  }



}
