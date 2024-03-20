const path = require('path');
const express = require('express');

const PORT = 5000

const app = express();

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT, () => {
    console.log( `Server running on port ${PORT}`);
})