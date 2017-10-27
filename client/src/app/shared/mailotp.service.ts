//---------------Importing Modules----------------------------------------------//
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
//--------------------------------------------------------------------------------//
@Injectable()
//-------------------------Exporting Module--------------------------------------------------------//
export class MailotpService {
  url:any="http://localhost:3000/otpVerify/";
  component:string;
  email:any;
  constructor(private http: Http) { }
  public sendMailOTP(Email, subject, component): Observable<any>{  
    const obj:any={'email':Email, 'content': subject};
    this.component=component;
    this.email=Email;
    return  this.http.post(this.url+"sendOTP",obj).map(res=>{  
      return res;
    })
  }

  public checkOTP(otp): Observable<any>{   
    const obj:any={'token':otp};
    return  this.http.post(this.url+"verifyOTP",obj).map(res=>{  
     return res;
    })                     
  }

}