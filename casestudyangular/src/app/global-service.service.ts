// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class GlobalServiceService {

//   constructor() { }
//   public pId:number;
// }

import { Injectable } from '@angular/core';
import { User } from './patientusecase/interfaces/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {

  constructor(private objHttp:HttpClient) { }
  public pId:number;
  loginDetails:User;
  readonly url="http://localhost:5012/api/Auth/Login"
  public Authorization(loginDetails){
    return this.objHttp.post(this.url,loginDetails)
  }
}