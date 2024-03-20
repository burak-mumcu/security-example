const path = require('path');
const fs = require('fs')
const express = require('express');
const https = require('https');

const PORT = 5000

const app = express();

app.get('/secret',(req,res) => {
    return res.send('Your secret value is 25')
})

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

https.createServer({
    cert:fs.readFileSync('cert.pem'),
    key:fs.readFileSync('key.pem'),
}, app).listen(PORT, () => {
    console.log( `Server running on port ${PORT}`);
})