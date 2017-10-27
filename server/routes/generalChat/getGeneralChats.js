const helper = require('../../utils/helper');
module.exports= function (request, response) {

        helper.getMessagesfromGeneral(function(error,result){
                if(error){

                        response.status(200).json(error);
                }
                else {
                       
                       response.status(200).json(result);
                   }

            })
        }