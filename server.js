var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//used for the get to pull file info
var path = require('path');

app.use(express.static(__dirname));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});