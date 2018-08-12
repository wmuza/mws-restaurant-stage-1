"use strict";

const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');

app.use('/img', express.static('img'));
app.use('/images_src', express.static('images_src'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/data', express.static('data'));

app.get('/', (req, res) =>  {
  res.sendFile(__dirname + '/');  
});

app.get('/restaurant.html', (req, res) =>  {
  res.sendFile(__dirname + '/restaurant.html');  
});

app.get('/sw.js', (req, res) =>  {
  res.sendFile(__dirname + '/sw.js');  
});

http.listen(80, () => console.log('listening on *:80'));
    