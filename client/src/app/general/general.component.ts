import { Component, OnInit } from '@angular/core';
import { GeneralChatService } from '../shared/general-chat.service';
import { ChatService } from './../chat.service';
import { HttpService } from './../http.service';
import {GeneralService}from './general.service';
import { ActivatedRoute ,Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
  providers:[GeneralChatService,ChatService,HttpService,GeneralService]
})
export class GeneralComponent implements OnInit {

 allGeneralMessages:any=[];
 private username = null;
 private userId = null; 
 message: string;
 messages: string[] = [];
 user:any;
 userfinal:any;
 serveruser:any;
 chatroom:string;
 currentUser:string;
 java:any="java";
 c:any="c";
 constructor(private generalChatService: GeneralChatService,private generalService:GeneralService,
   private chatService : ChatService,
   private route :ActivatedRoute,
   private router :Router)   {}

 sendMessage(callback1=()=>{

    console.log("*****************");
    this.generalService.saveMessage(this.username,this.message)
    .subscribe((current: string) => {

      if(current){
        this.retreive();
      }
     
    console.log("sendMessage save general",current);
    // this.currentUser=current;
    });

    console.log("This is after serveice call through compoentr*****************");


 },callback2=()=>{


 let currentTime = moment().format('hh:mm:ss a');
   this.generalChatService.sendMessage(this.message+ " " +this.username);
   this.generalChatService.getCurrent()
    .subscribe((current: string) => {
    console.log("component",current);
    this.currentUser=current;
    });

 })


 {
callback1();
callback2();
   //-------------------------------- for sending to scket.io just for triggering--------------------------------------------//
// callback2()
// {

//    let currentTime = moment().format('hh:mm:ss a');
//    this.generalChatService.sendMessage(this.message+ " " +this.username);
//    this.generalChatService.getCurrent()
//     .subscribe((current: string) => {
//     console.log("component",current);
//     this.currentUser=current;
//     });

//--------------------------------- for saving message in mongoclient-------------------------------------//
// }

// callback1()
// {
    // console.log("*****************");
    // this.generalService.saveMessage(this.username,this.message)
    // .subscribe((current: string) => {

    //   if(current){
    //     this.retreive();
    //   }
     
    // console.log("sendMessage save general",current);
    // // this.currentUser=current;
    // });

    // console.log("This is after serveice call through compoentr*****************");
// }

 }
 
// get room name from dropdown and the service
room(room):any{
 this.chatroom=room;
 console.log(this.chatroom);
 this.generalChatService.chatRoom();
 this.generalChatService.getChatRoom();
}

 sendUserName(){
   console.log(this.username);
   this.generalChatService.sendUser(this.username);
   this.userfinal=this.username;
   // this.user='';
 }

 disconnectUser(){
   this.generalChatService.disconnectUsers();
 }


//getting all the general channel saved messages from the db
retreive(){

this.generalService.retrieveMessage().subscribe((generalmessage: string) => {
    console.log("received general messages",generalmessage);


this.allGeneralMessages=generalmessage;
    // this.currentUser=current;
    });
}


 ngOnInit() {



this.retreive();

// this.getCurrentUser()
  
  this.userId = this.route.snapshot.params['userid'];
  if(this.userId === '' || typeof this.userId == 'undefined') {
      this.router.navigate(['/']);
    }else{

      /*
      * function to check if user is logged in or not starts
      */  
      this.chatService.userSessionCheck(this.userId,( error, response )=>{
          if(error) {
            this.router.navigate(['/']); /* Home page redirection */
          }else{
            
            this.username = response.username;
            console.log("##############",this.username);
            this.sendUserName();
          }
        }
        )}



// getting message through sockrt io
   this.generalChatService
     .getMessages()
     .subscribe((message: string) => {
       if(message){
         this.retreive();
       }
       
       // let currentTime = moment().format('hh:mm:ss a');
       // let messageWithTimestamp = `${currentTime}: ${message}`;
       // this.messages.push(messageWithTimestamp);


     });






     this.generalChatService.getUserName()
      .subscribe((message: string) => {
       let currentTime = moment().format('hh:mm:ss a');
       let messageWithTimestamp =  `${currentTime}: ${message}`;
       this.serveruser=message;
       console.log("@@@@@@@@@@@@",this.serveruser);
     });

   

 }


}
