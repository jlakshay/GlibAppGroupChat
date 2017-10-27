import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
@Injectable()
export class RegisterService {
data: any;
  constructor(private http: Http) { }


public tempUser(info:any){
this.data = info;
console.log(this.data);

}
public register(): Observable<any>{
	//let d = localStorage.getItem('tempuser.Email')
	console.log(this.data.email)
	const url="http://localhost:3000/register";
	return this.http
	.post(url,this.data)
	.map((res:Response)=>{return res.json(); });
}

}
