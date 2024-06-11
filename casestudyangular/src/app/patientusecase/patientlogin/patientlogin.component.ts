import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { NgForm } from '@angular/forms';
import { AuthenticatedResponse } from '../interfaces/authenticated-response.model';
import { User } from '../interfaces/user.model';
import { GlobalServiceService } from '../../global-service.service';


@Component({
  selector: 'app-patientlogin',
  templateUrl: './patientlogin.component.html',
  styleUrls: ['./patientlogin.component.css']
})
export class PatientloginComponent implements OnInit {
  
  invalidLogin: boolean;
  
 credentials:User={UserName:'',Password:''}
 AuthResponse:AuthenticatedResponse;
  constructor(private router: Router, private http: HttpClient,public glbsrv:GlobalServiceService) {}

  ngOnInit(): void {}

  login=(form: NgForm) => {
    if (form.valid) 
    {
      this.glbsrv.Authorization(this.credentials).subscribe
      (
        (response:AuthenticatedResponse)=>
        {
          this.AuthResponse=response;
          const token=response.token;
          localStorage.setItem("jwt",token)
          this.glbsrv.pId=response.id;
          this.navigateToSelectedRole(this.AuthResponse);
        },
        (error)=>
        {
          alert("No user found with those Details");
        }
      )

      
    }
  }
  navigateToSelectedRole(AuthResponse){
    if(AuthResponse.role=="Patient"){
      this.invalidLogin = false;
      
      this.router.navigate(['patient']);
    }
    else if(AuthResponse.role=="Doctor"){
      this.invalidLogin = false;
      this.router.navigate(["doctor"]);
      
    }
    else if(AuthResponse.role=="Admin"){
      this.invalidLogin = false;
      this.router.navigate(["RedirectToAdminNav"]);
      
    }
    else{
      alert("No user Found check the credentials and login ")
    }
  }
  
}