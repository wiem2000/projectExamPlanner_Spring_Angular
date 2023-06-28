import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Planification } from 'src/app/models/planification';
import { Voeux } from 'src/app/models/voeux';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PersonneService } from 'src/app/services/personne.service';
import { PlanificationService } from 'src/app/services/planification.service';
import { VoeuxService } from 'src/app/services/voeux.service';
declare let $: any;

@Component({
  selector: 'app-voeux-list-enseignant',
  templateUrl: './voeux-list-enseignant.component.html',
  styleUrls: ['./voeux-list-enseignant.component.css']
})
export class VoeuxListEnseignantComponent implements OnInit {

  voeux!:Voeux[];
  user!: any;
  addForm!:FormGroup;
  submitted=false;
  planifications!:Planification[];
  btn="";
  selectForm!: FormGroup;

  
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
    this.selectForm.get("select")?.patchValue(null);
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
    this.selectForm = this.formBuilder.group({
      select: new FormControl('')
    });
  }


  onDismiss(idModal:any)
  {
    $("#"+idModal).modal("hide");

  }
  addVoeux() {
    this.btn="v";
    $("#addVoeux").modal("show");
    
  }
  get addF() { return this.addForm.controls; }
  
  onChoisir() {
    
    this.submitted = true;
    if(this.addForm.invalid){return;}
    if (this.submitted) {

     
      let planif=this.addForm.value.planif;
     if(this.btn=="v")
      {
        this.router.navigate([`mesVoeux/add_voeux/${planif.id_planif}`]);
        this.btn="";
      }
      else if(this.btn=="c"){
        this.router.navigate([`mesVoeux/convocation/${planif.id_planif}`]);
        this.btn="";
      }
      else if(this.btn=="p"){
        this.router.navigate([`mesVoeux/planification/${planif.id_planif}`]);
        this.btn="";
      }
      $("#addVoeux").modal("hide");
    }

  }
  getConv() {
    this.btn="c"
    $("#addVoeux").modal("show");
  }
  getPlanif() {
    this.btn="p"
    $("#addVoeux").modal("show");
  }

  onChangePlanif(planif: Planification) {

    if (this.selectForm.value.select == 'tous') {
      this.getVoeux()
    }
    else {
      if (planif) {
        const results: Voeux[] = [];
        for(let v of this.voeux)
        {
          if(v.idExamenSalle.idExamen.idPlanification.id_planif==planif.id_planif)
          {
            results.push(v);


          }
        }
        this.voeux=results

      }
    }

  }
 
  
 


}
