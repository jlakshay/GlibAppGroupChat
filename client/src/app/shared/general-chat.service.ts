import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

export class GeneralChatService {
    private url = 'http://localhost:4000';
    private socket;


    constructor() {


        this.socket = io(this.url);


          this.socket.on('some-event', (chatRoom) => {
                console.log("getchatRoom",chatRoom);
                // observer.next(chatRoom);
            });



          this.getMessages();
    }

    public sendMessage(message) {
        this.socket.emit('new-message', message);
        
    }

    public sendUser(user){
        this.socket.emit('new-user',user,function(data){
if(data){

}
        });

    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }

//to store usernames in anarray
    public getUserName(){

       return Observable.create((observer) => {
            this.socket.on('username', (username) => {
                observer.next(username);
            });
        });
    }



//to get the current socket user
    public getCurrent(){
       return Observable.create((observer) => {
            this.socket.on('usercurrent', (username) => {
                console.log("service",username);
                observer.next(username);
            });
        });
    }

//to disconnect the user from the current chat room on the button
    public disconnectUsers(){
        this.socket.emit('disconnect');
    }

//to activate socket.io to get the current user
    public getCurentUser(){
    
            this.socket.emit('getcurrentuser');
    }


    public chatRoom(){
        console.log("inside service chat room");
        this.socket.emit('chat-rooms');
    }

    public getChatRoom(){
        console.log("inside service getChat Room");
          return Observable.create((observer) => {
          
        });
    }
}