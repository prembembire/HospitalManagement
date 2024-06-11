import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrl: './adminnav.component.css'
})
export class AdminnavComponent {
  constructor(public navbar:AuthService,private router:Router,private jwtHelper:JwtHelperService,public homenav:AuthService){}
  dispContent:boolean;
  ngOnInit(){
    this.dispContent=true
  }

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt");

    if (token && !this.jwtHelper.isTokenExpired(token)){
      this.homenav.login();
      return true;
    }

    return false;
  }

  logOut(){
    localStorage.removeItem("jwt");
    this.router.navigate(['']);
    this.homenav.logout();
    this.dispContent=false
  }

  showContent()
  {
    this.dispContent=false;
  }


}
