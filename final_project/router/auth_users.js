const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.some(user => {
    return user.username === username;
  });
}

const authenticatedUser = (username,password)=>{
  return users.some((user) => {
    return user.username === username && user.password === password;
  });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "User or password not provided" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username }, "access", { expiresIn: 60 * 60 }
    );

    return res.status(200).json({ message: "Successfully logged in", token: accessToken });
  }
  return res
    .status(208)
    .json({ message: "Invalid login." })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const bookIsbn = req.params.isbn;
    const reviewText = req.body.review;
    const username = req.user.username;

    const book = books[bookIsbn];
    if(!reviewText) {
      
    return res.status(400).json({ message: "Incorrect payload" });
    }

    if (book) {
      console.log('username', username)
      console.log('reviewText', reviewText)
      book.reviews[username] = reviewText;
      return res.status(200).json({ message: "Review added/modified sucessfully" });
    }
    
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding/modifying review" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const bookIsbn = req.params.isbn;
    const username = req.user.username;

    const book = books[bookIsbn];

    if (book) {
      const { [username]: _, ...remainingReviews } = book.reviews
      book.reviews = remainingReviews;
      return res.status(200).json({ message: "Review deleted sucessfully" });
    }
    
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
