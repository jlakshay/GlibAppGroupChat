const helper = require('../../utils/helper');
module.exports= function (request, response) {

        console.log("This is addgeneralchat serverside",request.body);
        var data={
            
            "username":request.body.username,
            "message":request.body.message,
            "timestamp":Date.now()
             }
        helper.insertMessagesToGeneral(data,function(error,result){
                if(error){

                        response.status(200).json(error);
                }
                else {
                       
                       response.status(200).json(result);
                   }

            })
        }