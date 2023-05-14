const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.every(item => item['username'] !== username)
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let [user] = users.filter(item => item["username"] === username);
  if (user) {
    if (user["password"] === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).json({
        message: "Logged in successfull."
      })
    } else {
      return res.status(401).json({
        message: "Incorrect username/password"
      })
    }
  } else {
    return res.status(401).json({
      message: "Please enter username/password"
    })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  books[isbn].reviews[username] = req.query.review;
  return res.status(200).json({ message: "Review has been posted." });
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review has been deleted." });
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
