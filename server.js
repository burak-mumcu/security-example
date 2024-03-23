const fs = require('fs')
const https = require('https');
const path = require('path');
const express = require('express');
const helmet = require('helmet')

const PORT = 3000

const app = express();

app.use(helmet());

function checkUser(req,res,next){
        const isLogged = true;
        if(!isLogged) return res.status(401).json({error:'Giriş yap'})
        next()
}

function checkPermission (req,res,next){
    // bu fonksiyon yetkilendirme kontrolleri için yazılacak
}

app.get('/auth/google',(req,res) => {})

app.get('/auth/google/callback',(req,res) => {})

app.get('/auth/logout',(req,res) => {})

app.get('/secret',checkUser,checkPermission, (req, res) => {
    return res.send('Your secret value is 25')
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