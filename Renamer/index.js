/**
 * Created by AdminPC on 24.03.2015.
 */
var argv = require('optimist').argv;
var fs = require("fs");

var findFiles =  function(dir){
    fs.readdir(dir, function (err, data) {
        if (!err) {
            data.forEach(function(file) {

                fs.stat(dir + '/' + file, function (err, stat){
                    if(stat.isDirectory()){
                        findFiles(dir + '/' + file);
                    }
                    if(stat.isFile()){
                        if (file.match(argv.find)) {
                            renameFile(file,  dir + '/' + file ,
                                dir + '/' + file.replace(argv.find, argv.replace));
                        }
                    }
                });
            });
        } else{
            return console.log("Error");
        }
    });
};

(function () {
    findFiles(argv.dirname);
})();

var renameFile = function(file, oldName, newName)
{
    fs.stat(oldName, function (err, stat) {

        if (stat.isFile()) {
            fs.rename(oldName, newName);
        }
    });
};




