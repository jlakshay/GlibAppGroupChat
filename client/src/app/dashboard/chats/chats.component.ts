import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';

import { SocketService } from './../../socket.service';
import { HttpService } from './../../http.service';
import { ChatService } from './../../chat.service';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
  
})
export class ChatsComponent implements OnInit {
/*
	* Chat and message related variables starts
	*/
	private userData:any;
	private userName = null;
	private userId = null;
	private socketId = null;
	private selectedSocketId = null;
	private selectedUserId = null;
	private chatListUsers = [];
	private message = '';
	private messages = [];
	/*
	* Chat and message related variables ends
	*/
  constructor(private route: ActivatedRoute,
  	private chatService : ChatService,
		private socketService : SocketService,
		private router :Router) { }

  ngOnInit() {
  	  this.route.params.subscribe(params => {
  	  	this.userData=params;
     this.selectedUserId=params.selectedUserId;
     this.userName=params.selectedUserName;
       this.userId=params.userId;
       this.selectedSocketId=params.selectedSocketId;
       //this.socketService.connectSocket(this.userId);
  	console.log(this.userData);
  	this.chatService.getMessages({ userId : this.userId,toUserId :this.selectedUserId} , ( error , response)=>{
			if(!response.error) {
				console.log("get message response",response.messages)
				let  aa=response.messages.map((i)=>{
					i.timestamp=new Date(i.timestamp*1000).toLocaleString();
					return i;
				});
				console.log("new timestamp",aa);
				this.messages = response.messages;

			}
		});



  });

  	  this.socketService.receiveMessages().subscribe(response => {
			    		console.log("this is@@@@@@@@@@@@@ ",response);
			    		
			    		var date = new Date((response.timestamp*1000));
			    		var newDate=date.toLocaleString();
							
							response.timestamp=newDate;
							console.log("date",newDate);
			    		if(this.selectedUserId && this.selectedUserId == response.fromUserId) {
			    			this.messages.push(response);
			    			// setTimeout( () =>{
			    			// 		document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
			    			// },100);
			    		}
			    	});

  	}




	sendMessageButton(){
		const data = {
						fromUserId : this.userId,
						message : (this.message).trim(),
						toUserId : this.selectedUserId,
						toSocketId : this.selectedSocketId,
						fromSocketId : this.socketId
					}
					this.messages.push(data);
					//setTimeout( () =>{
	    				//	document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
	    			//},100);
					this.message = null;
			
					this.socketService.sendMessage(data);
				
	}


	sendMessage(event){
		if(event.keyCode === 13) {
			if(this.message === '' || this.message === null) {
				alert(`Message can't be empty.`);
			}else{

				if (this.message === '') {
					alert(`Message can't be empty.`);
				}else if(this.userId === ''){
					this.router.navigate(['/']);					
				}else if(this.selectedUserId === ''){
					alert(`Select a user to chat.`);
				}else{

					const data = {
						fromUserId : this.userId,
						message : (this.message).trim(),
						toUserId : this.selectedUserId,
						toSocketId : this.selectedSocketId,
						fromSocketId : this.socketId
					}
					this.messages.push(data);
					//setTimeout( () =>{
	    			//		document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
	    			//},100);
					
					/* 
					* calling method to send the messages
					*/
					this.message = null;
					this.socketService.sendMessage(data);
				}
			}
		}
	}

	alignMessage(userId){
		return this.userId ===  userId ? false : true;
	}

}
