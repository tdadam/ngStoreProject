var express = require('express');
var app = express();
var bodyParse = require('body-parser');
var fs = require('fs');
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({
    extended: true
}));

app.use('/', express.static(__dirname));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

passport.use('facebook', new FacebookStrategy({
        clientID: '661695950638053',
        clientSecret: '4084a4ffb47ccace28b52570ca12719d',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        cb(null, profile);
    }
));

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/fail' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log(err, user, info);
        res.json(user);
    })(req, res, next);
});

app.listen(3000, function () {
    console.log('App listening on port 3000...');
});
