import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Voeux } from 'src/app/models/voeux';
import { VoeuxService } from 'src/app/services/voeux.service';

@Component({
  selector: 'app-voeux-list',
  templateUrl: './voeux-list.component.html',
  styleUrls: ['./voeux-list.component.css']
})
export class VoeuxListComponent implements OnInit {
  voeux!:Voeux[];
  

  
  constructor(
    
  private voeuxService:VoeuxService, ) { }

  ngOnInit(): void {
    
   
  
  
    this.getVoeux();
  }

  public getVoeux(): void {

    this.voeuxService.getVoeux().subscribe(
      response => {
        this.voeux= response;
        console.log(this.voeux);


      },
      (error: HttpErrorResponse) => { alert(error.message); }

    )

  }




//chercher voeux _______________________________________________________________
/*
public chercherVoeux(key: string): void {
  console.log(key);
  const results: Voeux[] = [];
  for (const voeux of this.voeux) {
    if (voeux.idEnseignant.prenom_pers.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||voeux.idEnseignant.nom_pers.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(key.toLowerCase()) !== -1
    
      || voeux.id_voeux.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(voeux);
    }
  }
  this.voeux = results;
  if (results.length === 0 || !key) {
    this.getVoeux();
  }
}
*/








}
