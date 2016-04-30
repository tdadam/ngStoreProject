var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/store-test';
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
        usernameField: 'email',
        passwordField: 'pass'
    },
    function (usernameField, passwordField, done) {
        //    done(null, {
        //        username: usernameField,
        //        password: passwordField
        //    });

        MongoClient.connect(url, function (err, db) {
            db.collection('users').findOne({username: usernameField}, function (err, user) {
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

app.post('/api/adduser', function (data) {
    //console.log(email);
    MongoClient.connect(url, function (err, db) {
        db.collection('users').insert({"email": data.email, "password": data.pass, "user": data.name} )

    });
});

    app.listen(3000, function () {
        console.log('App listening on port 3000...');
    });
