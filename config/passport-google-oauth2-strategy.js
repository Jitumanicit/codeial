const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for gogle login
passport.use(new googleStrategy({
        clientID: "755634550973-q57h89lgtqrg370j2hknb81kj1peg64f.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('Error in google strategy-passport', err);
                return;
            }
            console.log(profile);
            if(user){
                //if found, set this user as req.user
                return done(null, user);
            } else {
                // if not founf create user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('Error in google strategy-passport', err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
));
module.exports = passport
