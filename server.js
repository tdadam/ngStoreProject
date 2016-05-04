var express = require('express');
var mongodb = require('mongodb');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var MongoClient = require('mongodb').MongoClient;
var db;

//The uri is the mongo connection info, comment out first line and uncomment the second to connect to mlab
var uri = 'mongodb://localhost/store-test';
//var uri = 'mongodb://admin:admin@ds032319.mlab.com:32319/matc-project';

// Initialize connection once
MongoClient.connect(uri, function(err, database) {
    if (err) throw err;

    db = database;

    // Start the application after the database connection is ready
    app.listen(3000);
    console.log("Listening on port 3000");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', express.static(__dirname));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
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
    function(username, password, done) {
        db.collection('users').findOne({
            "email": username,
            "password": password
        }, function(err, user) {
            console.log(user);
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
                //return done(401, false, {message: 'User not found'});
            }
            if (user.password != password) {
                return done(null, false);
                //return done(418, {success: false, message: 'Incorrect password'});
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
        //successRedirect: '/',
        //failureRedirect: '/#/login'
        //failureFlash: true
    }),
    function(req, res) {
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
        //TODO: changed the _id to email to allow update on profile page, not sure how this check is affected
        if (err != null && err.errmsg == 'E11000 duplicate key error collection: store-test.users index: email dup key: { : "' + req.body.email + '" }') {
            res.send('Email already registered');
        } else {
            res.end();
        }
    });
//profile information
app.put('/api/profile/user',
 function(req, res) {
   db.collection('users').update({
     '_id': req.body._id
   },{
     "user": req.body.user
   })
 })
app.put('/api/profile/pass',
  function(req, res) {
    db.collection('users').update({
      '_id': req.body._id
    },{
      "password": req.body.pass
    })
  })
app.put('/api/profile/email',
    function(req, res) {
      db.collection('users').update({
        '_id': req.body._id
      },{
        "password": req.body.email
      })
    })
});
