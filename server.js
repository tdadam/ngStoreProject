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
var uri = 'mongodb://admin:admin@ds032319.mlab.com:32319/matc-project';

app.use('/', express.static(__dirname));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'randomSecret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize connection once
MongoClient.connect(uri, function (err, database) {
    if (err) throw err;
    db = database;
    // Start the application after the database connection is ready
    app.listen(3001);
    console.log("Listening on port 3000");
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

//Not being used, I removed the button on the UI
passport.use('facebook', new FacebookStrategy({
        clientID: '661695950638053',
        clientSecret: '4084a4ffb47ccace28b52570ca12719d',
        callbackURL: "http://localhost:3001/auth/facebook/callback",
        //callbackURL: "http://ec2-52-39-187-1.us-west-2.compute.amazonaws.com/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'photos']
    },
    function (accessToken, refreshToken, user, done) {
        db.collection('users').findOneAndUpdate({'_id': user.id}, {
            "_id": user.id,
            "user": user.displayName,
            "provider": "facebook",
            "email": user.photos[0].value
        }, {
            upsert: true
        });
        return done(null, user);
    }));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass'
    },
    function (username, password, done) {
        db.collection('users').findOne({
            "email": username,
            "password": password
        }, function (err, user) {
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

//Could not get this to serialize, removed login option
app.get('/auth/facebook',
    passport.authenticate('facebook'));

//Could not get this to serialize, removed login option
app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        function (req, res) {
            req.login(req.user, function (error) {
                if (error) {
                    console.log('error login', error);
                    res.redirect('/login');
                } else {
                    console.log('login success');
                    res.redirect('/');
                }
            });
        }));

//attempting to find the serialized user, but did not get what I needed in the console.
app.get('/fbcheck', function (req, res) {
    console.log(req.headers);
    console.log(req.session);
    res.end();
});

app.post('/api/login',
    passport.authenticate('local', {}),
    function (req, res) {
        res.json(req.user);
    });

//adds the new user to the database, returning message to client if email already used
app.post('/api/adduser', function (req, res) {
    db.collection('users').insertOne({
        "email": req.body.email,
        "password": req.body.pass,
        "user": req.body.user,
        "provider": "email"
    }, function (err, result) {
        if (err != null && err.code == 11000) {
            res.send('Email already registered');
        } else {
            res.end();
        }
    });
});

app.post('/api/additem', function (req, res) {
    console.log(req.headers);
    console.log(req.session);
    db.collection('items').insertOne({
        "userId": req.body.userId,
        "itemObject": req.body.item
    }, function (err, result) {
        if (err) {
            res.send('could not add item');
        } else {
            res.end();
        }
    });
});

app.get('/api/getitems/:id', function (req, res) {
    db.collection('items').find({"userId": req.params.id}).toArray(function (err, doc) {
        if (err) throw error;
        res.send(doc);
    });
});

app.delete('/api/deleteItem/:id',
    function (req, res) {
        db.collection('items').deleteOne({
            "_id": new mongodb.ObjectID(req.params.id)
        }, function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                res.end();
            }
        });
    });

//profile information
app.put('/api/profile/user',
    function (req, res) {
        db.collection('users').findOneAndUpdate({
                "_id": new mongodb.ObjectID(req.body._id)
            }, {
                $set: {
                    "user": req.body.user
                }
            },
            function (err, result) {
                if (err) {
                    res.send("There was an error: " + err);
                } else {
                    res.json(req.body);
                }
            });
    });

app.put('/api/profile/pass',
    function (req, res) {
        db.collection('users').findOneAndUpdate({
                "_id": new mongodb.ObjectID(req.body._id)
            }, {
                $set: {
                    "password": req.body.password
                }
            },
            function (err, result) {
                if (err) {
                    res.send("There was an error: " + err);
                } else {
                    res.json(req.body);
                }
            });
    });

app.put('/api/profile/email',
    function (req, res) {
        db.collection('users').findOneAndUpdate({
                "_id": new mongodb.ObjectID(req.body._id)
            }, {
                $set: {
                    "email": req.body.email
                }
            },
            function (err, result) {
                if (err != null && err.code == 11000) {
                    res.send('Email already registered');
                } else {
                    res.json(req.body);
                }
            });
    });
