const http = require('http');
const https = require('https');
const querystring =require('querystring');

let post = function(hostname, path, port, body, callback){
    let post_body = querystring.stringify(body);
    let options = {
        hostname:hostname,
        port:port,
        path:path,
        method:'POST',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length': post_body.length
        }
    };
    let req = http.request(options, function(res){callback(res)});
    // write data to request body
    req.write(post_body);
    req.end();
};


function syncHttpGet(hostname, path, port){
    return new Promise(function(resolve,reject){
        let options = {
            hostname:hostname,
            port:port,
            path:path,
            method:'GET'
        };
        let req = http.request(options, function(res){
            resolve(res);
        });
        // write data to request body
        req.end();
    });
}

function syncHttpsGet(hostname, path, port, cookie) {
    return new Promise(function(resolve,reject) {
        let options = {
            host: hostname,
            port: port,
            path: path,
            method: 'GET',
            headers: {
                'Cookie': cookie
            }
        };

        https.get(options, function (res) {
            resolve(res);
        }).on("error", function (err) {
            console.log(err);
        });
    });
}


module.exports= {
    post: post,
    syncHttpsGet: syncHttpsGet,
    syncHttpGet: syncHttpGet
};

