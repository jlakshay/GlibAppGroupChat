//-----------------------Importing Modules-----------------------------------------//
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class GeneralService {

  constructor(private http:Http) { }

  saveMessage(username,message): Observable<any>{
  let obj:any={};
  obj={
  	"username":username,
  	"message":message
  }
  console.log("This is service method general.service OBJ->>",obj);
	const url="http://localhost:4000/generalChats";
    return this.http
    .post(url,obj) //calling the http function
    .map((res)=>res.json());
  	
   }



   retrieveMessage():Observable<any>{
   	const url="http://localhost:4000/generalChats";
    return this.http
    .get(url) //calling the http function
    .map((res)=>{
console.log("this is general response",res)
    	return res.json()});
   }
	}
