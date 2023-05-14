const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({
        username: username,
        password: password
      })
    } else {
      return res.status(403).json({
        message: "This usename already taken"
      })
    }
  }else{
    return res.status(400).json({
      message: "Enter username/password"
    })
  }
  return res.status(200).json({ message: "Registration success, now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  let getBooks = await books;
  return res.status(200).json(getBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    let bookToSend = await books[req.params.isbn];
    return res.status(200).json(bookToSend);
  }
  return res.status(207).json({
    "message": "Book not found"
  })
});
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let author = req.params.author;
  let keysArr = Object.keys(books);
  let book = keysArr.filter(item => author === books[item].author);
  if (book.length > 0) {
    let requstedBooks = {};
    book.forEach((key) => {
      requstedBooks[key] = books[key];
    })
    return res.status(200).json(requstedBooks)
  }
  return res.status(404).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let title = req.params.title;
  let keysArr = Object.keys(books);
  let book = keysArr.filter(item => title === books[item].title);
  if (book.length > 0) {
    let requstedBooks = {};
    book.forEach((key) => {
      requstedBooks[key] = books[key];
    })
    return res.status(200).json(requstedBooks)
  }
  return res.status(404).json({ message: "Book not found" });
});

public_users.get('/review/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    if (Object.keys(book['reviews']).length === 0) {
      return res.status(200).json({ "message": "No reviews" })
    }
    return res.status(200).json(book['reviews']);
  }
  return res.status(404).json({
    "message": "Book not found"
  })
})

module.exports.general = public_users;
