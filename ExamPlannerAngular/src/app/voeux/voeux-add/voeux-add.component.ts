import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenSalle } from 'src/app/models/examen-salle';
declare let $: any;
import { Planification } from 'src/app/models/planification';
import { Seance } from 'src/app/models/seance';
import { Voeux, VoeuxNonValide } from 'src/app/models/voeux';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExamenSalleService } from 'src/app/services/examen-salle.service';
import { PersonneService } from 'src/app/services/personne.service';
import { PlanificationService } from 'src/app/services/planification.service';
import { SeanceService } from 'src/app/services/seance.service';
import { VoeuxService } from 'src/app/services/voeux.service';
import Swal from 'sweetalert2';
import * as ts from 'typescript';

@Component({
  selector: 'app-voeux-add',
  templateUrl: './voeux-add.component.html',
  styleUrls: ['./voeux-add.component.css']
})
export class VoeuxAddComponent implements OnInit {
  planif!: Planification;
  user!: any;
  public dates: Date[] = [];
  public seances!: Seance[]; public seancesPlanif: Seance[] = [];
  public voeuxEns: Voeux[] = [];
  totalVoeux!: Voeux[]
  public voeuxNonValide: VoeuxNonValide[] = [];
  public due!: number
  public clicked = false;
  totalExamSalle!: ExamenSalle[];
  rest: any;
  currentDate:Date=new Date();
  date_debut_acceptation_voeux!:Date;



  constructor(private planificationService: PlanificationService, private route: ActivatedRoute, private seanceService: SeanceService,
    private authenticationService: AuthenticationService, private personneService: PersonneService, public voeuxService: VoeuxService,
    private examen_salleService: ExamenSalleService, private router: Router) { }

  ngOnInit(): void {

    const planifId = +this.route.snapshot.params['id'];
    console.log("this" + planifId);

    this.planificationService.getPlanificationById(planifId).subscribe(
      response => {
        this.planif = response;
        console.log(this.planif)

        this.date_debut_acceptation_voeux=new Date(this.planif.date_debut_lancement_voeux)
     


        if(this.date_debut_acceptation_voeux<=this.currentDate && this.planif.date_debut_lancement_voeux!=null )
{
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

        let x = setInterval(() => {
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
      }
      , (error: HttpErrorResponse) => { alert(error.message); }

    )

    


  }
  public getCode(x: Date, s: Seance): string {
    return new Date(x).toLocaleDateString() + s.num_seance.toString();
  }


  onDateSeance(x: Date, s: Seance) {
    
    let capacite=this.nbVoeuxDispo(x, s);
    if (new Date(this.planif.date_fin_lancement_voeux).getTime() - new Date().getTime() > 0) {
    let td = document.getElementById(this.getCode(x, s)) as HTMLInputElement;
   
   


    
      if (td) {
        if (td.innerHTML == '') {
          
          if((capacite != 0 ||this.existeVoeux(this.voeuxEns,s,x)==true )&& this.due != 0 )
            {td.innerHTML = "clicked";
            td.style.backgroundColor = "red"

            let v = new VoeuxNonValide();
            v.idSeance = s;
            v.jour = x;

            this.voeuxNonValide.push(v);
            this.due--;
        }
          

        }
        else {
          capacite++
          
          this.due++;
          td.style.backgroundColor = "transparent";
          td.innerHTML = '';
          this.voeuxNonValide.forEach((element, index) => {
            if (element.idSeance.num_seance == s.num_seance && new Date(element.jour).toLocaleDateString() == new Date(x).toLocaleDateString()) this.voeuxNonValide.splice(index, 1);
          });

        }


      }
    
    console.log(this.voeuxNonValide);
  }
  }

  onAnnuler(){
    window.location.reload()
  
  }

  onValider() {
    if (new Date(this.planif.date_fin_lancement_voeux).getTime() - new Date().getTime() > 0) {
      
      if (this.voeuxNonValide.length != 0) {
        if (this.due == 0) {
          
           for(let efface of this.voeuxEns){
            
            this.voeuxService.deleteVoeux(efface.id_voeux).subscribe(
              (response: void) => {
console.log("efface"+efface.id_voeux)

this.voeuxService.getVoeux().subscribe(
  response => {
    this.totalVoeux = response;
    console.log(this.totalVoeux.length);
  },
  (error: HttpErrorResponse) => { alert(error.message); });

              
               
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
             
            }
           this.getPersonnes();

console.log(this.voeuxEns);
console.log(this.voeuxNonValide);

            for (let v of this.voeuxNonValide) {
              let listeExamSalle = this.examen_salleService.getExamenSallesByDateSeancePlanif(this.totalExamSalle, v.jour, v.idSeance, this.planif);
              let listeVoeux = this.voeuxService.getVoeuxByDateSeancePlanif(this.totalVoeux, v.jour, v.idSeance, this.planif)
              let dispo = false; let i = 0;
              while (i < listeExamSalle.length && dispo == false) {
                if ((this.voeuxService.getVoeuxByExamSalle(listeVoeux, listeExamSalle[i]).length < 2 && listeExamSalle[i].idSalle.type_salle == 'normal') || (this.voeuxService.getVoeuxByExamSalle(listeVoeux, listeExamSalle[i]).length < 1 && listeExamSalle[i].idSalle.type_salle == 'Laboratoire')) {
                  dispo = true;
                  for (let es of listeExamSalle) {
                    if (es.idSalle.num_salle == listeExamSalle[i].idSalle.num_salle) {
                      let voeux = new Voeux()
                      voeux.idEnseignant = this.user;
                      voeux.idExamenSalle = es;
                      this.voeuxService.addVoeux(voeux).subscribe(
                        response => {
                          console.log(voeux);

                        },
                        (error: HttpErrorResponse) => { alert(error.message); }
                      );
                    }
                  }

                }
                else i++;

              }
            }
           

            Swal.fire({
              title: 'Succés!!',
              text: "vos voeux sont ajoutés avec succés",
              icon: 'success'
            });


            this.getPersonnes();
            this.router.navigate([`mesVoeux`]);
          
        }
        else
          Swal.fire({
            title: 'erreur!!',
            html: "<br>Vous avez encore <b> "+ this.due+" séance(s) </b> a choisir . <br>Veuillez remplir les champs restants.<br><br><b>NB:</b> Votre charge de surveillance est de "+this.user?.idGrade?.charge_surv +" séance(s) obligatoire(s).",
            icon: 'error'
          });

      }
      else Swal.fire({
        title: 'Erreur !!',
        text: "Veuillez choisir vos séances de surveillance .",
        icon: 'error'
      });

    }
    else Swal.fire({
      title: 'Désolé !!',
      text: "La date d'acceptation des voeux est expirée , Votre convocation de surveillance sera disponible ultérieurement.",
      icon: 'error'
    });
  }

  public getPersonnes(): void {

    this.personneService.getPersonnes().subscribe(
      response => {
        let personnes = response;
        this.user = this.authenticationService.getUserLoggedIn(personnes)

        this.voeuxService.getVoeuxByEnseignant(this.user?.id_pers).subscribe(
          response => {
            let voeux = response;
            

            this.voeuxEns = this.voeuxService.getVoeuxByEnseignantByPlanif(voeux, this.planif)
            console.log(this.voeuxEns)


            let nbVoeux = this.voeuxEns.length

            for (let x = 0; x < this.voeuxEns.length; x++) {
              let v: VoeuxNonValide = new VoeuxNonValide();
              v.idSeance = this.voeuxEns[x].idExamenSalle.idExamen.idSeance;
              v.jour = new Date(this.voeuxEns[x].idExamenSalle.idExamen.date_exam);
              if(this.existe(this.voeuxNonValide,v.idSeance,v.jour)==false)
               {this.voeuxNonValide.push(v);
                let td = document.getElementById(this.getCode(v.jour, v.idSeance)) as HTMLInputElement;
                td.innerHTML = "clicked";
                td.style.backgroundColor="red";
              
              }
             
              for (let y = x + 1; y < this.voeuxEns.length; y++) {
                if (new Date(this.voeuxEns[x].idExamenSalle.idExamen.date_exam).toLocaleDateString() == new Date(this.voeuxEns[y].idExamenSalle.idExamen.date_exam).toLocaleDateString() && this.voeuxEns[x].idExamenSalle.idExamen.idSeance.num_seance == this.voeuxEns[y].idExamenSalle.idExamen.idSeance.num_seance && this.voeuxEns[x].idExamenSalle.idSalle.num_salle == this.voeuxEns[y].idExamenSalle.idSalle.num_salle)
                 { nbVoeux = nbVoeux - 1 }
              }



            }
            console.log("tableau des voeux")
            console.log(this.voeuxNonValide);

            this.due = this.user.idGrade.charge_surv - nbVoeux


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

  existe(list: VoeuxNonValide[], s: Seance, j: Date): boolean {
    let trouve = false; let i = 0
    while (i < list.length && trouve == false){
      if (list[i].idSeance.num_seance == s.num_seance && new Date(list[i].jour).toLocaleDateString() == new Date(j).toLocaleDateString()) trouve = true;
      else i++;}
    return trouve;


  }
  existeVoeux(list:Voeux[], s: Seance, j: Date): boolean {
    let trouve = false; let i = 0
    while (i < list.length && trouve == false){
      if (list[i].idExamenSalle.idExamen.idSeance.num_seance == s.num_seance && new Date(list[i].idExamenSalle.idExamen.date_exam).toLocaleDateString() == new Date(j).toLocaleDateString()) trouve = true;
      else i++;}
    return trouve;


  }

  nbVoeuxDispo(x: Date, s: Seance): number {
    let nbEns = 0;
    let listeExamSalle = this.examen_salleService.getExamenSallesByDateSeancePlanif(this.totalExamSalle, x, s, this.planif);
    let listeVoeux = this.voeuxService.getVoeuxByDateSeancePlanif(this.totalVoeux, x, s, this.planif)

    for (let es of listeExamSalle) {
      if (es.idSalle.type_salle == 'Laboratoire') nbEns = nbEns + 1
      else nbEns = nbEns + 2;

    }
    return nbEns - listeVoeux.length;




  }






}
