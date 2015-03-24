var http = require('http');
var fs = require('fs');
var mime = require('mime');
var url = require("url");

http.createServer(function(req, res){
    var request = url.parse(req.url, false);
    var action = '.' + request.pathname;
    var mimeType = mime.lookup(action);

    fs.readFile(action, function(err, content){
        if (!err) {
            res.writeHead(200, {'Content-Type': mimeType });
            res.end(content, 'utf-8');
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain' });
            res.end('Not found \n');
        }
    });
}).listen(8080, '127.0.0.1');




