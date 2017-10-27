
'use strict';
var Helper = /** @class */ (function () {
    function Helper() {
        this.Mongodb = require("./db");
    }
    /*
    * Name of the Method : userNameCheck
    * Description : To check if the username is available or not.
    * Parameter :
    *		1) data query object for MongDB
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.userNameCheck = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').find(data).count(function (err, result) {
                db.close();
                callback(result);
            });
        });
    };
    /*
    * Name of the Method : login
    * Description : login the user.
    * Parameter :
    *		1) data query object for MongDB
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.login = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').findAndModify(data, [], { $set: { 'online': 'Y' } }, {}, function (err, result) {
                db.close();
                callback(err, result.value);
            });
        });
    };
    /*
    * Name of the Method : registerUser
    * Description : register the User
    * Parameter :
    *		1) data query object for MongDB
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.registerUser = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').insertOne(data, function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    /*
    * Name of the Method : userSessionCheck
    * Description : to check if user is online or not.
    * Parameter :
    *		1) data query object for MongDB
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.userSessionCheck = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').findOne({ _id: ObjectID(data.userId), online: 'Y' }, function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    /*
    * Name of the Method : getUserInfo
    * Description : to get information of single user.
    * Parameter :
    *		1) userId of the user
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.getUserInfo = function (userId, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').findOne({ _id: ObjectID(userId) }, function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    /*
    * Name of the Method : addSocketId
    * Description : Updates the socket id of single user.
    * Parameter :
    *		1) userId of the user
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.addSocketId = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').update({ _id: ObjectID(data.id) }, data.value, function (err, result) {
                db.close();
                callback(err, result.result);
            });
        });
    };
    /*
    * Name of the Method : getChatList
    * Description : To get the list of online user.
    * Parameter :
    *		1) userId (socket id) of the user
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.getChatList = function (userId, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('users').find({ 'online': 'Y', socketId: { $ne: userId } }).toArray(function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    /*
    * Name of the Method : insertMessages
    * Description : To insert a new message into DB.
    * Parameter :
    *		1) data comprises of message,fromId,toId
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.insertMessages = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('messages').insertOne(data, function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    Helper.prototype.insertMessagesToGeneral = function (data, callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            console.log(data);
            db.collection('generalChannel').insertOne(data, function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    ;
    Helper.prototype.getMessagesfromGeneral = function (callback) {
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('generalChannel').find({}).toArray(function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    ;
    /*
    * Name of the Method : getMessages
    * Description : To fetch messages from DB between two users.
    * Parameter :
    *		1) userId, toUserId
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.getMessages = function (userId, toUserId, callback) {
        var data = {
            '$or': [
                { '$and': [
                        {
                            'toUserId': userId
                        }, {
                            'fromUserId': toUserId
                        }
                    ]
                }, {
                    '$and': [
                        {
                            'toUserId': toUserId
                        }, {
                            'fromUserId': userId
                        }
                    ]
                },
            ]
        };
        this.Mongodb.onConnect(function (db, ObjectID) {
            db.collection('messages').find(data).sort({ 'timestamp': 1 }).toArray(function (err, result) {
                db.close();
                callback(err, result);
            });
        });
    };
    /*
    * Name of the Method : getMessages
    * Description : To fetch messages from DB between two users.
    * Parameter :
    *		1) userID
    *		2) callback function
    * Return : callback
    */
    Helper.prototype.logout = function (userID, isSocketId, callback) {
        var data = {
            $set: {
                online: 'N'
            }
        };
        this.Mongodb.onConnect(function (db, ObjectID) {
            var condition = {};
            if (isSocketId) {
                condition.socketId = userID;
            }
            else {
                condition._id = ObjectID(userID);
            }
            db.collection('users').update(condition, data, function (err, result) {
                db.close();
                callback(err, result.result);
            });
        });
    };
    return Helper;
}());
module.exports = new Helper();
