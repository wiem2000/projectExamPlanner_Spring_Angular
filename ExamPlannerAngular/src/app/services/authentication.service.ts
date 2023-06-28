import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compte } from '../models/compte';
import { Personne } from '../models/personne';
import { PersonneService } from './personne.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private personneService:PersonneService) { }

  public existCompte(comptes: Compte[], compte: Compte): Compte {


    for (var c of comptes) {
      if (c.login == compte.login && c.mdp == compte.mdp) {
        return c;
      }
    }

    return null as any;
  }
  public getPersonneByCompte(personnes: Personne[], compte: Compte): Personne {


    for (var p of personnes) {
      if (p.idCompte.id_compte === compte.id_compte) {
        return p;
      }
    }

    return null as any;
  }
  /*
        authenticate(compte:Compte,comptes:Compte[],personnes:Personne[]) {
          let p:Personne ;
          if (this.existCompte(comptes,compte)!=null) {
             p=this.getPersonneByCompte(personnes,compte);
            sessionStorage.setItem('id_pers',p.email);
            return true;
          } else {
            return false;
          }
        }*/

  isUserLoggedIn() {
    let user = sessionStorage.getItem('email')

    return !(user === null)
  }

  public getUserLoggedIn(personnes: Personne[]): Personne {

    if (this.isUserLoggedIn()) {
      let user = sessionStorage.getItem('email');
      for (var p of personnes) {
        if (p.email === user) {
          return p;
        }
      }


    }
    return null as any;


  }




  logOut() {
    sessionStorage.removeItem('email')
  }
}
