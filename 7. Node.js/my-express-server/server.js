//jshint esversion:6

const express = require("express");
const app = express();

app.get("/", function(req, res) {
  res.send("<h1>Hello World!</h1>");
});

app.get("/contact", function(req, res) {
  res.send("Contact me at: tony@gmail.com");
});

app.get("/about", function(req, res) {
  res.send("My name is Tony and I love technologies");
});

app.get("/hobbies", function(req, res) {
  res.send("<ul><li>Coffee</li><li>Code</li><li>Rubik's Cube</li></ul>");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});