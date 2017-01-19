var cric_api_helper = require('./helper.js');
var jsonfile = require('./playerstats.json');
var fs = require('fs');
var request = 3000;
var obj = {
    table: []
};


var options = {
    call_type: 'playerStats',
    pid: request
};
var enough = true;


var players_recursion = function (request) {

    options.pid = request;
    cric_api_helper.cricAPICall(options).
        then(function (return_data) {
            if (return_data.fullName) {
                obj.table.push(
                    {
                        pid: request,
                        name: return_data.fullName
                    });
            }
            if (request >= 10000) {
                writefile(obj);
                enough = false;
            }
            request += 1;
            console.log(request);
            if (enough) {
                players_recursion(request);
            }
            console.log(obj);
        }).
        catch(function (err) {
            console.log(err);
        });
}

var writefile = function (obj) {
    var json = JSON.stringify(obj);
    fs.readFile('playerstats.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFile('playerstats.json', json, 'utf8'); // write it back
        }
    })
}


players_recursion(request);
