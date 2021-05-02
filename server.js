'use strict';

//Application Dependencies
require('dotenv');
const express = require('express');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT || 3010;
const server = express();

server.set('view engine', 'ejs');

server.get('/', (req,res)=>{
  res.render('pages/index');
});

server.get('/', (req,res)=>{
  res.render('pages/index');
});

server.listen(PORT, ()=>{
  console.log(`Lesiting to PORT ${PORT}`);
});
