import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';


/* Importing services starts*/
import { SocketService } from './../socket.service';
import { HttpService } from './../http.service';
import { ChatService } from './../chat.service';
/* Importing services ends*/
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

/*
* UI related variables starts
*/
private editflag=false;
private overlayDisplay = false;
private selectedUserId = null;
private selectedSocketId = null;
private selectedUserName = null;	
/* 
* UI related variables ends
*/

/*
* Chat and message related variables starts
*/
private username = null;
private userId = null;
private socketId = null;
private currentRoute=null;
private chatListUsers = [];

/*
* Chat and message related variables ends
*/
constructor(private chatService : ChatService,
	private socketService : SocketService,
	private route :ActivatedRoute,
	private router :Router) { }

ngOnInit() {
/*
* getting userID from URL using 'route.snapshot'
*/		
this.currentRoute=this.router.url;
console.log("#########",this.currentRoute);
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
		this.overlayDisplay = true;

/*
* making socket connection by passing UserId.
*/	
this.socketService.connectSocket(this.userId);

/*
* calling method of service to get the chat list.
*/	
this.socketService.getChatList(this.userId).subscribe(response => {

	if(!response.error) {

		if(response.singleUser) {

/* 
* Removing duplicate user from chat list array.
*/
if(this.chatListUsers.length > 0) {
	this.chatListUsers = this.chatListUsers.filter(function( obj ) {
		return obj._id !== response.chatList._id;
	});
}

/* 
* Adding new online user into chat list array
*/
this.chatListUsers.push(response.chatList);

}else if(response.userDisconnected){
	this.chatListUsers = this.chatListUsers.filter(function( obj ) {
		return obj.socketId !== response.socketId;
	});
}else{
/* 
* Updating entire chatlist if user logs in.
*/
this.chatListUsers = response.chatList;
}
}else{
	alert(`Chat list failure.`);
}
});


}

});
}
}
isUserSelected(userId:string):boolean{
		if(!this.selectedUserId) {
			return false;
		}
		return this.selectedUserId ===  userId ? true : false;
	}
	selectedUser(user):void{
		console.log("$$$$$$$$$$$$$",user);
		let userData={
			"userId":this.userId,
		"selectedUserId":user._id,
		"selectedSocketId":user.socketId,
		"selectedUserName":user.username
	};
	this.router.navigate([this.currentRoute+'/chats',userData]);
		//this.router.navigate([this.currentRoute+'/chats'],{ queryParams: user, skipLocationChange: true});


	}
}
