const fs = require('fs')
const https = require('https');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

require('dotenv').config()

const PORT = 3000

const config = {
    CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET : process.env.GOOGLE_SECRET_ID,
    COOKIE_KEY_1 : process.env.COOKIE_KEY_1,
    COOKIE_KEY_2 : process.env.COOKIE_KEY_2
};

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET, 
 }

function verifyCallback(accessToken, refreshToken, profile, done){
    console.log('google profile ',profile);
    done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))

const app = express();

app.use(helmet());

app.use(cookieSession({
    name:'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1,config.COOKIE_KEY_2]
}))

app.use(passport.initialize());

function checkUser(req,res,next){
        const isLogged = true;
        if(!isLogged) return res.status(401).json({error:'Giriş yap'})
        next()
}


app.get('/auth/google',passport.authenticate('google',{
    scope:[ 'email','profile'],
}))

app.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect: '/failure',
    successRedirect:'/',
    session:false
}),(req,res) => {
    console.log('google called us back')
})

app.get('/auth/logout',(req,res) => {})

app.get('/secret',checkUser,checkPermission, (req, res) => {
    return res.send('Your secret value is 25')
})

app.get('/failure',(req,res) => {
    res.send('Failed to log in');
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer({
    key: fs.readFileSync('newkey.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})