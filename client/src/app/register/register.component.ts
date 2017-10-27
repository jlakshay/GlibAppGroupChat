
 /*importing the dependency*/
 import * as config from './config/multi_en_config.json';
 import { Component, OnInit } from '@angular/core';
 import { RegisterService } from '../shared/register.service';
 import { Router ,ActivatedRoute} from '@angular/router';
 import { MailotpService} from '../shared/mailotp.service';
 import { User } from '../User';
 import { ChatService } from './../chat.service';
import { HttpService } from './../http.service';
 
 //import * as moment from 'moment';
 @Component({
   selector: 'app-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.css'],
   providers : [ChatService,HttpService]
   
 })
 //Exporting RegisterComponent class//
 export class RegisterComponent{
   /*declaration of variable*/
   
   public word = (<any>config).register;
   //public now = moment().format('YYYY-MM-DD')
   errorMsg:string;
   private username = null;
      private email = null;
      private password = null;
 
      private isuserNameAvailable = false;
      private userTypingTimeout= 500;
      private typingTimer = null;
   constructor(
     private mailotp:MailotpService,private chatService : ChatService,
          private router :Router
     ) { }



    public onkeyup(event){
          clearTimeout(this.typingTimer);
          this.typingTimer = setTimeout( ()=>{
              this.chatService.checkUserNameCheck({
                    'username' : this.username
                }, (response)=>{
                    if(response.error) {
                        this.isuserNameAvailable = true;
                    }else{
                        this.isuserNameAvailable = false;
                    }
                });
          }, this.userTypingTimeout);
      }
 
      public onkeydown(event){
    clearTimeout(this.typingTimer);
      }
   //register method//
   
  public registerUser():void{
        
        if(this.username === '') {
            alert(`Username can't be empty.`);
        }else if(this.email === ''){
            alert(`Email can't be empty.`);
        }else if(this.password === ''){
            alert(`Password can't be empty.`);
        }else{
           this.chatService.registerUser({
                username : this.username,
                email : this.email,
                password : this.password
            },(error , result)=>{
                if(error) {
                    alert(result);
                }else{
                    if(!result.error) {
                        this.router.navigate(['/login']);
                    }else{
                        alert(`Registration failure.`);
                    }
                }
            });
        }
    }

 ngOnInit() {
   // initialize model here
  

   }
 }


