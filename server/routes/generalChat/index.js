const express = require("express");
let getChats=require('./getGeneralChats');
let addChats=require('./addGeneralChats');
let router=express.Router();
router.get('/',getChats);
router.post('/',addChats);
module.exports=router;