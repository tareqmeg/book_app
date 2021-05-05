DROP TABLE IF EXISTS bookSelf;

CREATE TABLE IF NOT EXISTS bookSelf ( 
    id SERIAL PRIMARY KEY,
    bookName VARCHAR (255),
    bookImageurl VARCHAR (255),
    bookAuther VARCHAR (255),
    bookPublisher VARCHAR (255),
    publishDate VARCHAR (255),
    bookDescription TEXT 
);