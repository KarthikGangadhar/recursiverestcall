var cric_api_helper = require('./helper.js');
var jsonfile = require('./playerstats.json');
var fs = require('fs');
var request = 35320;
var obj = {
   table: []
};


var options = {
    call_type: 'playerStats',
    pid: request
 };
var enough = true;


var players_recursion = function(request){

        options.pid= request;
        cric_api_helper.cricAPICall(options).
        then(function (return_data) {
            // console.log(return_data);
            if(return_data.fullName){
                obj.table.push(
                    {
                        pid: request, 
                        name:return_data.fullName 
                    });
            }
            if(request > 35370){
                enough = false;
            }
            request += 1;
            if(enough){
            players_recursion(request);                
            }
            console.log(obj);
        }).
        catch(function (err) {
            console.log(err);
        });
    }

players_recursion(request);

// try{
// // for(var i =0; i<3; i++){

// // }

// }
// catch(err){
// console.log(err);
// }

// obj.table.push({id: 1, square:2});
    // var json = JSON.stringify(obj);
    // fs.writeFile('myjsonfile.json', json, 'utf8', callback);
    // fs.readFile('./playerstats.json', 'utf8', function readFileCallback(err, data){
    //     if (err){
    //         console.log(err);
    //     } else {
    //         obj = JSON.parse(data); //now it an object
    //         obj.table.push({pid: request, name:""}); //add some data
    //         json = JSON.stringify(obj); //convert it back to json
    //         fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back
    //     }})