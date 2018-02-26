#!/usr/bin/env node

var express = require('express');
var fs = require('fs');
var url = 'http://localhost:8000/';

var app = express.createServer();
app.configure(function() {
	app.use(app.router);
	app.use(express.static(__dirname));
});

app.get('/thanks', function(req, res){
    res.sendfile('thanks.html', {root: __dirname});
});

app.get('/save_result', function(req, res){
    var textResult = "kspc : " + req.query["kspc"] + " ; wpm : " + req.query["wpm"];
    fs.writeFileSync('./result.txt', textResult, function (err) {
        if (err) {
            return console.log('there is an error');
        }

        console.log('the file was saved');
    });
    res.redirect(url + 'thanks');
});

app.listen(8000);
console.log("Fast times at " + url);
