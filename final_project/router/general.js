const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred." });
    }
    return res.status(400).json({ message: "Username is already taken" });
  }
  return res
    .status(400)
    .json({ message: "Username or password not provided." });
});

// Task 1
public_users.get('/',function (req, res) {
return res.status(200).json({message: "Ok", data: books });
});

// Task 2
public_users.get('/isbn/:isbn',function (req, res) {
  const bookIsbn = req.params.isbn;
  if (!books[bookIsbn]) {
    return res.status(400).json({message: "Not found" });
  }
  return res.status(200).json({message: "Ok", data: books[bookIsbn] });
 });
  
// Task 3
public_users.get('/author/:author',function (req, res) {
  const bookAuthor = req.params.author;
  const results = Object.values(books).filter(el => el.author === bookAuthor)

  return res.status(200).json({message: "Ok", data: results });
});

// Task 4
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title;
  const results = Object.values(books).filter(el => el.title === bookTitle)

  return res.status(200).json({message: "Ok", data: results });
});

// Task 5
public_users.get('/review/:isbn',function (req, res) {
  const bookIsbn = req.params.isbn;
  if (!books[bookIsbn]) {
    return res.status(400).json({message: "Not found" });
  }
  return res.status(200).json({message: "Ok", data: books[bookIsbn].reviews });
});

// Common function
async function getBooksAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Task-10
public_users.get("/async", async function (req, res) {
  try {
    const books = await getBooksAsync("http://localhost:5000/");
    return res.status(200).json({message: "Ok", data: books });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching books");
  }
});

// Task-11
public_users.get("/async/isbn/:isbn", async function (req, res) {
  try {
    const bookIsbn = req.params.isbn;
    const book = await getBooksAsync(`http://localhost:5000/isbn/${bookIsbn}`);
    return res.status(200).json({message: "Ok", data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task-12
public_users.get("/async/author/:author", async function (req, res) {
  try {
    const bookAuthor = req.params.author;
    const book = await getBooksAsync(
      `http://localhost:5000/author/${bookAuthor}`
    );
    return res.status(200).json({message: "Ok", data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task-13
public_users.get("/async/title/:title", async function (req, res) {
  try {
    const bookTitle = req.params.title;
    const book = await getBooksAsync(
      `http://localhost:5000/title/${bookTitle}`
    );
    return res.status(200).json({message: "Ok", data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

module.exports.general = public_users;
