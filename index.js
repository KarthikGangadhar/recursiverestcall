
const apecricket = require('ape-cricket');
const api_key = "q19DZlg6wdgAdlyhYS1Ndh3R0jc2"
const data = require("./playerstats.json");
const fs = require("fs");
const httpRequest = require('request');
const url = "https://athletes-api.herokuapp.com/crickers";
var responseArray = [];
var requestArray = [];

const writefile = (obj) => {
    return new Promise((resolve, reject) => {
        if (obj && obj.length > 0) {
            obj.forEach((response) => {
                validate_response(JSON.parse(response)).then((validResponse) => {
                    PostResponse(url, validResponse).then((httpResponse) => {
                        resolve(httpResponse);
                    }).catch((err) => {
                        console.log(err);
                    })
                })
            })
        }
        resolve(obj);
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
    writefile(response);
}).then(respArr => {
    console.log(respArr);
})

var PostResponse = (url, body) => {
    return new Promise(function (resolve, reject) {
        httpRequest.post(url, {
            json: body,
        }, (err, resp, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(resp.body);
            }
        });
    })
};


const validate_response = (response) => {
    return new Promise((resolve, reject) => {
        let data = response
        if (response && response.data && Object.keys(response.data).length > 0) {
            format_object(response.data).then((obj) => {
                resolve(obj);
            })
        } else {
            reject("response ids not valid");
        }
    })
}

const format_object = (playerResponse) => {
    return new Promise((resolve, reject) => {
        if (playerResponse) {
            for (let key in playerResponse) {
                if (key === "v" || key === "ttl" || key === "provider" || key === "creditsLeft") {
                    delete playerResponse[key]
                }
                else if (key === "pid") {
                    playerResponse[key] = playerResponse[key].toString();
                }
                else if (playerResponse[key] && typeof playerResponse[key] === "object") {
                    format_object(playerResponse[key])
                }
                else if (playerResponse[key] === "" || playerResponse[key] === null || playerResponse[key] === undefined) {
                    delete playerResponse[key];
                }
            }
            resolve(playerResponse)
        }
        else {
            reject("RESPONSE IS EMPTY");
        }

    });
}
