var async = require('async'),
    request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    argv = require('optimist').argv;


var startUrl = argv.url,
    level = argv.level,
    resultsUrls = [],
    fileName = "./test.json";


var getLinksFromPage = function (urls, callback) {
    async.map(urls, getUrls, function (error, results) {
        if (error) {
            console.log(error);
            return callback(null, error);
        }
        level--;

        var childsUri = [];
        results.forEach(function (result) {
            for (var i = 0; i < result.length; i++) {
                if(result[i].indexOf('http://') === 0)
                    childsUri.push(result[i]);
            }
        });
        resultsUrls = resultsUrls.concat(childsUri);

        if (level > 0)
                getLinksFromPage(childsUri, callback);
        else
            callback(null, resultsUrls);
    });
};

var getUrls  = function(url,  callback){
    request(url, function (error, response, html) {
        if(error){
            console.log(error);
            return callback(null, error);
        }
        $ = cheerio.load(html);
        var childUrls = [];

        $('a').each(function (index, element) {
            childUrls.push($(element).attr('href'));
        });

        return callback(null, childUrls);

    });
};




    var writeFile = function (urls, callback) {

        fs.writeFile(fileName, JSON.stringify(urls, null, 4), function (error) {
            if (error) {
                console.error(error);
                return callback(null, error);
            }else{
                callback(null, fileName);
            }
        });
    };

    async.waterfall([
        function (callback) {
            getLinksFromPage([startUrl], callback);
        },
        function (urls, callback) {
            writeFile(urls, callback);
        }
    ], function (error, result) {
        if (error)
            return console.log(error);

        console.log("Links saved on path: " + result);
    });

