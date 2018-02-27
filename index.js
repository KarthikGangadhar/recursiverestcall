const apecricket = require('ape-cricket');
const api_key = "yiPB2mqlqdNnPa57Vs8P8S74DXk1"
const data = require("./playerstats.json");
const fs = require("fs");
var responseArray = [];

const writefile = (obj) => {
    return new Promise((resolve, reject) => {
        var json = obj;
        // var json = JSON.stringify(obj);
        fs.readFile('playerstat.json', 'utf8', (err, data) => {
            if (err) {
                resolve(err);
            } else {
                fs.writeFile('playerstat.json', json, 'utf8'); // write it back
                resolve("OK")
            }
        })
    });
}

const get_data = (request) => {
    return new Promise((resolve, reject) => {
        if (request && request.pid) {
            apecricket.playerStats(api_key, request.pid, (response) => {
                return resolve(response);
            });
        } else {
            return resolve({})
        }
    });
}

var promiseArray = [];
data.table.forEach(element => {
    promiseArray.push(get_data(element).then((response) => {
        return response;
    }));
})

Promise.all(promiseArray).then(response => {
    // responseArray.push(JSON.parse(response));
    writefile(response);  
}).then(respArr =>{
    console.log(respArr);
    // writefile(JSON.parse(response))
})