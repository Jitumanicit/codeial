const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done){
        //find the user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error', err);
                return done(err);
            }
            if(!user || user.password != password){
                req.flash('error', 'Invalied Username / Password');
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done){
    done(null, user.id)
})

//deserilizing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding --> Passport');
            return done(err);
        }
        return done(null, user);
    })
})

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;