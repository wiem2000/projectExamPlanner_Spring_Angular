import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExamenService } from './services/examen.service';
import {ExamenListComponent} from './examen/examen-list/examen-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanificationListComponent } from './planification/planification-list/planification-list.component';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { PlanificationDetailComponent } from './planification/planification-detail/planification-detail.component';
import { LoginComponent } from './authentification/login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './header/header.component';
import { ActiverCompteComponent } from './authentification/activer-compte/activer-compte.component';
import { MdpOublieComponent } from './authentification/mot-de-passe-oublie/mdp-oublie/mdp-oublie.component';
import { MdpOublieEditComponent } from './authentification/mot-de-passe-oublie/mdp-oublie-edit/mdp-oublie-edit.component';
import { ModifierCompteComponent } from './authentification/modifier-compte/modifier-compte.component';
import { PlanificationTableauComponent } from './planification/planification-tableau/planification-tableau.component';
import { ContrainteListComponent } from './contrainte/contrainte-list/contrainte-list.component';
import { LazyComponentComponent } from './lazy-component/lazy-component.component';
import { MatiereListComponent } from './matiere/matiere-list/matiere-list.component';
import { UtilisateurListComponent } from './utilisateur/utilisateur-list/utilisateur-list.component';
import { ExamenDetailComponent } from './examen/examen-detail/examen-detail.component';
import { GradeListComponent } from './grade/grade-list/grade-list.component';
import { ModuleListComponent } from './module/module-list/module-list.component';
import { NiveauListComponent } from './niveau/niveau-list/niveau-list.component';
import { ParcoursListComponent } from './parcours/parcours-list/parcours-list.component';
import { SalleListComponent } from './salle/salle-list/salle-list.component';
import { SeanceListComponent } from './seance/seance-list/seance-list.component';
import { VoeuxListComponent } from './voeux/voeux-list/voeux-list.component';
import { VoeuxAddComponent } from './voeux/voeux-add/voeux-add.component';
import { VoeuxEnseignantComponent } from './voeux/voeux-enseignant/voeux-enseignant.component';
import { VoeuxListEnseignantComponent } from './voeux/voeux-list-enseignant/voeux-list-enseignant.component';
import { ConvocationComponent } from './voeux/convocation/convocation.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { PlanificationsComponent } from './voeux/planifications/planifications.component';
import { PlanificationValideComponent } from './planification/planification-valide/planification-valide.component'


@NgModule({
  declarations: [
    AppComponent,
    ExamenListComponent,
    
    PlanificationListComponent,
    PlanificationDetailComponent,
    LoginComponent,
    LandingPageComponent,
    HeaderComponent,
    ActiverCompteComponent,
    MdpOublieComponent,
    MdpOublieEditComponent,
    ModifierCompteComponent,
    PlanificationTableauComponent,
    ContrainteListComponent,
    LazyComponentComponent,
    MatiereListComponent,
    UtilisateurListComponent,
    ExamenDetailComponent,
    GradeListComponent,
    ModuleListComponent,
    NiveauListComponent,
    ParcoursListComponent,
    SalleListComponent,
    SeanceListComponent,
    VoeuxListComponent,
    VoeuxAddComponent,
    VoeuxEnseignantComponent,
    VoeuxListEnseignantComponent,
    ConvocationComponent,
    WelcomePageComponent,
    PlanificationsComponent,
    PlanificationValideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [ExamenService,{provide:LOCALE_ID, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(){ registerLocaleData(fr.default);}
}
