'use strict';

//Application Dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');


// Application Setup
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());

server.set('view engine', 'ejs');

server.use(express.static('./public'));
// server.use(express.static('./views'));

const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );




server.get('/SearchResults',(req,res)=>{
  let SQL = 'SELECT * FROM bookSelf;';
  client.query(SQL).then(results=>{
    console.log(results.rows);
    res.render('pages/index',{items: results.rows});
  });
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

  this.bookName = (bookData.volumeInfo.title) ? bookData.volumeInfo.title: 'do not have data';
  this.bookImageurl = (bookData.volumeInfo.imageLinks.thumbnail)? bookData.volumeInfo.imageLinks.thumbnail: 'do not have data';
  this.bookAuther = (bookData.volumeInfo.authors)? bookData.volumeInfo.authors:'do not have data';
  this.bookPublisher = (bookData.volumeInfo.publisher)? bookData.volumeInfo.publisher: 'do not have data';
  this.publishDate = (bookData.volumeInfo.publishedDate)? bookData.volumeInfo.publishedDate: 'do not have data';
  this.bookDescription = (bookData.volumeInfo.description)? bookData.volumeInfo.description: 'do not have data';

}

server.post('/addbook', addbookHandler);
function addbookHandler(req,res){
  let {title,image,author,publisher,Pdate,description} = req.body;
  let SQL = `INSERT INTO bookSelf (bookName,bookImageurl,bookAuther,bookPublisher,publishDate,bookDescription) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`;
  let safeValues = [title,image,author,publisher,Pdate,description];
  client.query(SQL,safeValues).then(result=>{
    console.log(result.rows);
    res.redirect(`/addbook/${result.rows[0].id}`);
  });

}
server.get('/addbook/:id', addOneBook);
function addOneBook(req,res){
  let SQL='SELECT * FROM bookSelf WHERE id=$1;';
  let safeValue = [req.params.id];
  client.query(SQL,safeValue).then(result=>{
    console.log(result.rows);
    res.render('pages/detail', {item: result.rows[0]});
  });
}
server.post('/updateBook/:id',updatHandler);
function updatHandler (req,res){
  let {title,image,auther,publisher,publishdate,description}= req.body;
  let Sql = `UPDATE bookSelf SET bookName=$1, bookImageurl=$2, bookAuther=$3, bookPublisher=$4,publishDate=$5,bookDescription=$6 WHERE id=$7;`;
  let updateValues = [title,image,auther,publisher,publishdate,description,req.params.id];
  client.query(Sql,updateValues).then(()=>{
    res.redirect(`/addbook/${req.params.id}`);
  });
}
server.post('/deleteBook/:id',deleteBookHandler);
function deleteBookHandler(req,res){
  let SQL=`DELETE FROM bookSelf WHERE id=$1;`;
  let value=[req.params.id];
  client.query(SQL,value)
    .then(()=>{
      res.redirect('/');
    });
}
server.get('/', (req,res)=>{
  let SQL = 'SELECT * FROM bookSelf;';
  client.query(SQL).then(results=>{
    console.log(results.rows);
    res.render('pages/index',{items: results.rows});
  });
});

server.get('*',(req,res)=>{
  res.render('pages/error');
});

client.connect().then(()=>{
  server.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`);
  });
});
