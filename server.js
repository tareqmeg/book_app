'use strict';

//Application Dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');


// Application Setup
const PORT = process.env.PORT || 5000;
const server = express();
server.use(cors());

server.set('view engine', 'ejs');

server.use(express.static('./public'));
server.use(express.static('./views'));
server.get('/SearchResults',(req,res)=>{
  res.render('pages/index');
});
server.get('/', (req,res)=>{
  res.render('pages/index');
});

server.get('/new', (req,res)=>{
  res.render('searches/new');
});
server.use(express.urlencoded({extended:true}));
server.post('/show',(req,res)=>{
  console.log(req.body.search);
  console.log(req.body.methodology);
  let serchQuery =req.body.search;
  let methodology = req.body.methodology;
  let url =`https://www.googleapis.com/books/v1/volumes?q=${serchQuery}+${methodology}`;
  superagent.get(url).then(bookData=>{
    console.log(bookData.body.volumeInfo);
    let gettedData = bookData.body.items;
    let newbookData = gettedData.map((items)=>{
      return new Book(items);
    });

    res.render('searches/shwo',{books:newbookData});
  });
});


function Book (bookData){

  this.bookName = bookData.volumeInfo.title;
  this.bookImageurl = bookData.volumeInfo.imageLinks.thumbnail;
  this.bookAuther = bookData.volumeInfo.authors;
  this.bookPublisher = bookData.volumeInfo.publisher;
  this.publishDate = bookData.volumeInfo.publishedDate;
  this.bookDescription = bookData.volumeInfo.description;

}

server.listen(PORT, ()=>{
  console.log(`Lesiting to PORT ${PORT}`);
});
