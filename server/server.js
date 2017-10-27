var express = require("express");
var http = require('http');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var cors = require('cors');
var socketEvents = require('./utils/socket');
var routes = require('./utils/routes');
var config = require('./utils/config');
var register = require('./routes/registerUser');
var userSessionCheck = require('./routes/userSessionCheck');
var userNameCheck = require('./routes/userNameCheck');
var login = require('./routes/login');
var generalChats = require('./routes/generalChat');
var messages = require('./routes/messages');
var Server = /** @class */ (function () {
    function Server() {
        this.port = process.env.PORT || 4000;
        this.host = "localhost";
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }
    Server.prototype.appConfig = function () {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:false}));
        this.app.use(cors());
        new config(this.app);
        this.app.use('/registerUser', register);
        this.app.use('/userSessionCheck', userSessionCheck);
        this.app.use('/usernameCheck', userNameCheck);
        this.app.use('/login', login);
        this.app.use('/generalChats', generalChats);
        this.app.use('/getMessages', messages);
    };
    /* Including app Routes starts*/
    Server.prototype.includeRoutes = function () {
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    };
    /* Including app Routes ends*/
    Server.prototype.appExecute = function () {
        var _this = this;
        this.appConfig();
        this.includeRoutes();
        this.http.listen(this.port, this.host, function () {
            console.log("Listening on http://" + _this.host + ":" + _this.port);
        });
    };
    return Server;
}());
var app = new Server();
app.appExecute();
