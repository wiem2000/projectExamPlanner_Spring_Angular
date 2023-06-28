import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiverCompteComponent } from './authentification/activer-compte/activer-compte.component';
import { LoginComponent } from './authentification/login/login.component';
import { ModifierCompteComponent } from './authentification/modifier-compte/modifier-compte.component';
import { MdpOublieEditComponent } from './authentification/mot-de-passe-oublie/mdp-oublie-edit/mdp-oublie-edit.component';
import { MdpOublieComponent } from './authentification/mot-de-passe-oublie/mdp-oublie/mdp-oublie.component';
import { ContrainteListComponent } from './contrainte/contrainte-list/contrainte-list.component';
import { ExamenDetailComponent } from './examen/examen-detail/examen-detail.component';

import { ExamenListComponent } from './examen/examen-list/examen-list.component';
import { GradeListComponent } from './grade/grade-list/grade-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LazyComponentComponent } from './lazy-component/lazy-component.component';
import { MatiereListComponent } from './matiere/matiere-list/matiere-list.component';
import { ModuleListComponent } from './module/module-list/module-list.component';
import { NiveauListComponent } from './niveau/niveau-list/niveau-list.component';
import { ParcoursListComponent } from './parcours/parcours-list/parcours-list.component';
import { PlanificationDetailComponent } from './planification/planification-detail/planification-detail.component';
import { PlanificationListComponent } from './planification/planification-list/planification-list.component';
import { PlanificationTableauComponent } from './planification/planification-tableau/planification-tableau.component';
import { PlanificationValideComponent } from './planification/planification-valide/planification-valide.component';
import { SalleListComponent } from './salle/salle-list/salle-list.component';
import { SeanceListComponent } from './seance/seance-list/seance-list.component';
import { UtilisateurListComponent } from './utilisateur/utilisateur-list/utilisateur-list.component';
import { ConvocationComponent } from './voeux/convocation/convocation.component';
import { PlanificationsComponent } from './voeux/planifications/planifications.component';
import { VoeuxAddComponent } from './voeux/voeux-add/voeux-add.component';
import { VoeuxEnseignantComponent } from './voeux/voeux-enseignant/voeux-enseignant.component';
import { VoeuxListEnseignantComponent } from './voeux/voeux-list-enseignant/voeux-list-enseignant.component';
import { VoeuxListComponent } from './voeux/voeux-list/voeux-list.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent, children: [
    { path: '', component: LoginComponent},
    { path: 'activerCompte', component: ActiverCompteComponent},
    { path: 'mdpOublie', component: MdpOublieComponent},
    { path: 'mdpOublie/edit/:id', component: MdpOublieEditComponent},
    
]  },
  
  {path:'list_exam',component:ExamenListComponent},
  {path:'list_exam/:id',component:ExamenDetailComponent},
  
  {path:'mesVoeux',component:VoeuxEnseignantComponent,children: [
    {path:'add_voeux/:id',component:VoeuxAddComponent},
    {path:'',component:VoeuxListEnseignantComponent},
    {path:'convocation/:id',component:ConvocationComponent},
    {path:'planification/:id',component:PlanificationsComponent},
  ] 
},
  {path:'dashboard',component:WelcomePageComponent},
  
  {path:'list_matiere',component:MatiereListComponent},
  {path:'list_module',component:ModuleListComponent},
  {path:'list_niveau',component:NiveauListComponent},
  {path:'list_parcours',component:ParcoursListComponent},
  {path:'list_voeux',component:VoeuxListComponent},
  {path:'list_grade',component:GradeListComponent},
  {path:'list_salle',component:SalleListComponent},
  {path:'list_seance',component:SeanceListComponent},
  {path:'list_utilisateur',component:UtilisateurListComponent},
  {path:'compte/:id',component:ModifierCompteComponent},
  {path:'planifications',component:PlanificationListComponent},
  {path:'planifications/:id',component:PlanificationDetailComponent,children:[
    {path:'affichage/:id',component:PlanificationValideComponent},
    {path:'planifier/:id',component:PlanificationTableauComponent},
    {path:'contraintes',component:ContrainteListComponent},
    {path:'*',component:LazyComponentComponent}
  ]},
  



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
