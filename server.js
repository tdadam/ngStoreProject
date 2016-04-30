var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost/store-test';
//var url = 'mongodb://admin:admin@ds032319.mlab.com:32319/matc-project';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', express.static(__dirname));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use('facebook', new FacebookStrategy({
        clientID: '661695950638053',
        clientSecret: '4084a4ffb47ccace28b52570ca12719d',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        cb(null, profile);
    }
));

function add(email, pass) {

}

passport.use(new LocalStrategy({
        email: 'email',
        passwordField: 'pass'
    },
    function (email, passwordField, done) {
        //    done(null, {
        //        username: usernameField,
        //        password: passwordField
        //    });

        MongoClient.connect(url, function (err, db) {
            db.collection('users').findOne({email: email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (!user.validPassword(passwordField)) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);

            });
        });

    }
));

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/fail'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.post('/api/login',
    passport.authenticate('local'),
    function (req, res, next) {
        res.json(req.user);
    });

app.post('/api/adduser', function (req, res, err) {
    MongoClient.connect(url, function (err, db) {
        //if (!db.collection('users').findOne({"email": req.body.email})) {
        db.collection('users').insert({
            "_id": req.body.email,
            "password": req.body.pass,
            "user": req.body.user
        }, function (err, result) {
            if (err != null && err.errmsg == 'E11000 duplicate key error collection: store-test.users index: _id_ dup key: { : "' + req.body.email + '" }') {
                res.send('Email already registered');
            }
            else {
                res.end();
            }

        });
    });
});

app.listen(3000, function () {
    console.log('App listening on port 3000...');
});
