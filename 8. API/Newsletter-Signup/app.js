//jshint esversion:6

//Constant part
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Sign-up page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Posting functions
app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var myUserId = config.userId;
  var myApiKey = config.apiKey;

  var options = {
    url: "https://us7.api.mailchimp.com/3.0/lists/" + myUserId,
    method: "post",
    headers: {
      "authorization": "tony1 "+ myApiKey
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

//Port
app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
