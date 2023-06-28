import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Personne } from 'src/app/models/personne';
import { PersonneService } from 'src/app/services/personne.service';
import { CompteService } from 'src/app/services/compte.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Compte } from 'src/app/models/compte';

@Component({
  selector: 'app-mdp-oublie-edit',
  templateUrl: './mdp-oublie-edit.component.html',
  styleUrls: ['./mdp-oublie-edit.component.css']
})
export class MdpOublieEditComponent implements OnInit {

  user!:Personne;
  compte!:Compte;
  mdpForm!: FormGroup;
  submitted = false;

  constructor(private route: ActivatedRoute,private personneService:PersonneService, private router:Router,
    private compteService:CompteService,private formBuilder: FormBuilder,private authenticationService:AuthenticationService) 
    { 
      this.mdpForm = this.formBuilder.group({
        mdp: new FormControl('',Validators.required),
        mdpConfirm: new FormControl('',Validators.required)

      },
      {
        validators:this.mustMatch('mdp','mdpConfirm')
      }
      
      );

    }

  ngOnInit(): void {
    const userID = +this.route.snapshot.params['id'];
    this.initForm();
    

    this.personneService.getPersonneById(userID).subscribe(
      response => {
        this.user = response;
        console.log("this" + this.user);
 
      }

      , (error: HttpErrorResponse) => { alert(error.message); }

    )
    this.compteService.getCompteByIdPersonne(userID).subscribe(
      response => {
        this.compte = response;
 
      }

      , (error: HttpErrorResponse) => { alert(error.message); }

    )
  }
  get mdpF() { return this.mdpForm.controls; }
 
  initForm() {
    /*
    this.mdpForm = this.formBuilder.group(
      {
         mdp: ['', [Validators.required]],
        mdpConfirm: ['', [Validators.required]],
       

      }
    );
    */


  }
mustMatch(mdp:any,mdpConfirm:any){
  return(formGroup:FormGroup)=>{
    const mdpControl=formGroup.controls[mdp];
    const mdpConfirrmControl=formGroup.controls[mdpConfirm];
    if(mdpConfirrmControl.errors && !mdpConfirrmControl.errors['mustMatch']){
      return;
    }
    if(mdpControl.value!==mdpConfirrmControl.value){
      mdpConfirrmControl.setErrors({mustMatch:true})
    }
    else{
      mdpConfirrmControl.setErrors(null);
    }
  }

}





  checkPasswords() { // here we have the 'passwords' group
    let pass = this.mdpForm.value.mdp;
    let confirmPass =this.mdpForm.value.mdpConfirm ;

    return pass === confirmPass ? null : { notSame: true }
  }

  public onSubmit(){
    
    this.submitted = true;
    if (this.mdpForm.invalid) { return; }
    if (!this.authenticationService.isUserLoggedIn()) {
      if(this.checkPasswords()==null)
      {

      if (this.submitted) {
        
        var compte=new Compte();
        compte=this.compte;
        
        compte.mdp=this.mdpForm.value.mdp;
       
  
        this.compteService.updateCompte(compte).subscribe(
          response => { console.log(this.compte); 
            Swal.fire({
              title: 'Succés!!',
              text: "mot de passe modifié avec succés",
              icon: 'success'
            });
            this.mdpForm.reset();
            this.router.navigate(['']);
          
          },
          (error: HttpErrorResponse) => { alert(error.message); }
        );

        
        
      }
    }
      else{
        Swal.fire({
          title: 'erreur mdp !!',
          text: "les mots de passe ne correspondent pas  ",
          icon: 'error'
        });
        this.mdpForm.reset();


      }





    }
    else {
      Swal.fire({
        title: 'Vous etes deja connecté !!',
        text: "Veuillez vous déconnecter ",
        icon: 'error'
      });


    }
  }

}
