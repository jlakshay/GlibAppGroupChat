
'use strict';
var path = require('path');
var helper = require('./helper');
var Socket = /** @class */ (function () {
    let usernames=[];
    function Socket(socket) {
        this.io = socket;
    }
    Socket.prototype.socketEvents = function () {
        var _this = this;
        this.io.on('connection', function (socket) {


 console.log('user connected');
        console.log("socket id",socket.id);


socket.on('chat-rooms', (message) => {
       console.log("inside server chatroom");

    socket.join('java');
  console.log(socket);
    _this.io.to('java').emit('some-event',"java");

    });


socket.on('new-user',function(data,callback){
if(usernames.indexOf(data)!= -1){
    callback(false);
}
else{
    callback(true);
    socket.username=data;
    console.log("ths is username",socket.username);
    usernames.push(socket.username);
    _this.io.emit('username',usernames);
    console.log("array",usernames);
}
});
    socket.on('new-message', (message) => {
        _this.io.emit('new-message', message);



        // socket.broadcast.emit('new-message', message);  //this is used to broadcast the message to all leaving the sender itself


 });

    socket.on('getcurrentuser',()=>{
    // console.log("dissconnect user",socket.username);
    // let index=usernames.indexOf(socket.username);
    // console.log("index",index);
  // usernames.splice(index,1);
  // console.log("updated array",usernames);
               //     socket.broadcast.emit('chat-list-response',{
               //     error : false ,
               //     userDisconnected : true ,
               //     socketId : socket.id
               // });
    console.log("current user",socket.username);
    _this.io.emit("usercurrent",socket.username)

           });



            /**
            * get the user's Chat list
            */
            socket.on('chat-list', function (data) {
                var chatListResponse = {};
                if (data.userId == '') {
                    chatListResponse.error = true;
                    chatListResponse.message = "User does not exits.";
                    _this.io.emit('chat-list-response', chatListResponse);
                }
                else {
                    helper.getUserInfo(data.userId, function (err, UserInfoResponse) {
                        delete UserInfoResponse.password;
                        helper.getChatList(socket.id, function (err, response) {
                            _this.io.to(socket.id).emit('chat-list-response', {
                                error: false,
                                singleUser: false,
                                chatList: response
                            });
                            socket.broadcast.emit('chat-list-response', {
                                error: false,
                                singleUser: true,
                                chatList: UserInfoResponse
                            });
                        });
                    });
                }
            });
            /**
            * send the messages to the user
            */
            socket.on('add-message', function (data) {
                if (data.message === '') {
                    _this.io.to(socket.id).emit("add-message-response", "Message cant be empty");
                }
                else if (data.fromUserId === '') {
                    _this.io.to(socket.id).emit("add-message-response", "Unexpected error, Login again.");
                }
                else if (data.toUserId === '') {
                    _this.io.to(socket.id).emit("add-message-response", "Select a user to chat.");
                }
                else {
                    var toSocketId_1 = data.toSocketId;
                    var fromSocketId = data.fromSocketId;
                    delete data.toSocketId;
                    data.timestamp = Math.floor(new Date() / 1000);
                    helper.insertMessages(data, function (error, response) {
                        _this.io.to(toSocketId_1).emit("add-message-response", data);
                    });
                }
            });
            /**
            * Logout the user
            */
            socket.on('logout', function (data) {
                var userId = data.userId;
                helper.logout(userId, false, function (error, result) {
                    _this.io.to(socket.id).emit('logout-response', {
                        error: false
                    });
                    socket.broadcast.emit('chat-list-response', {
                        error: false,
                        userDisconnected: true,
                        socketId: socket.id
                    });
                });
            });
            /**
            * sending the disconnected user to all socket users.
            */
            socket.on('disconnect', function () {
                    console.log("dissconnect user",socket.username);
    let index=usernames.indexOf(socket.username);
    console.log("index",index);
  usernames.splice(index,1);

  
  console.log("updated array",usernames);
                socket.broadcast.emit('chat-list-response', {
                    error: false,
                    userDisconnected: true,
                    socketId: socket.id
                });
            });
        });
    };
    Socket.prototype.socketConfig = function () {
        this.io.use(function (socket, next) {
            var userID = socket.request._query['userId'];
            var userSocketId = socket.id;
            var data = {
                id: userID,
                value: {
                    $set: {
                        socketId: userSocketId,
                        online: 'Y'
                    }
                }
            };
            helper.addSocketId(data, function (error, response) {
                // socket id updated.
            });
            next();
        });
        this.socketEvents();
    };
    return Socket;
}());
module.exports = Socket;
