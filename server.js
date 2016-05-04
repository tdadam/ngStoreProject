var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongodb = require('mongodb');
var fs = require('fs');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var db;

//The uri is the mongo connection info, comment out first line and uncomment the second to connect to mlab
var uri = 'mongodb://localhost/store-test';
//var uri = 'mongodb://admin:admin@ds032319.mlab.com:32319/matc-project';

app.use('/', express.static(__dirname));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: 'randomSecret', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize connection once
MongoClient.connect(uri, function(err, database) {
    if (err) throw err;
    db = database;
    // Start the application after the database connection is ready
    app.listen(3000);
    console.log("Listening on port 3000");
});
passport.serializeUser( function(user, done){
    done(null, user._id)
});

passport.deserializeUser(function (obj, done){
        done(null, obj);
});

passport.use('facebook', new FacebookStrategy({
        clientID: '661695950638053',
        clientSecret: '4084a4ffb47ccace28b52570ca12719d',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass'
    },
    function (username, password, done) {
        db.collection('users').findOne({"email": username, "password": password}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//Not started, attempting local first
app.get('/auth/facebook',
    passport.authenticate('facebook'));

//Not started, attempting local first
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/fail'
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

//Work in progress...not quite getting through to database
app.post('/api/login',
    passport.authenticate('local', {
    }), function (req, res) {
        res.json(req.user);
    });

//adds the new user to the database, returning message to client if email already used
app.post('/api/adduser', function(req, res) {
    db.collection('users').insert({
        "email": req.body.email,
        "password": req.body.pass,
        "user": req.body.user,
        "provider": "email"
    }, function (err, result) {
        if (err != null && err.errmsg == 'E11000 duplicate key error collection: store-test.users index: email dup key: { : "' + req.body.email + '" }') {
            res.send('Email already registered');
        } else {
            res.end();
        }
    });
//profile information
app.put('/api/profile',
 function(req, res) {
   db.collection('users').update({
     '_id': req.body._id
   },{
     "email": req.body.email,
     "password": req.body.pass,
     "user": req.body.user
   })
 })
});