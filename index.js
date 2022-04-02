const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
//user for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
// const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server to br used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on the port 5000');
const path = require('path');


if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));
//make this upload folder available in browser
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
//extract style and script in sub pages into layouts
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)


//Setup view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    secret: 'blahsomething',
    saveUninitialized : false,
    resave : false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    }
    // store: new MongoStore(
    //     {
    //         mongooseConnection: db,
    //         autoRemove: 'disabled'
    //     },
    //     function(err){
    //         console.log(err || 'connect-mongodb setup ok');
    //     }
    // )
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){ 
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server running in the port : ${port}`);
})