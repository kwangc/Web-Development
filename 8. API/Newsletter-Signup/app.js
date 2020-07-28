//jshint esversion:6

//Constant part
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

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
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  //listID
  const url = "https://us7.api.mailchimp.com/3.0/lists/asdf";

  //API Key
  const options = {
    method: "POST",
    auth: "tony1:asdf"
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

// var options = {
//   url: "https://us7.api.mailchimp.com/3.0/lists/"+process.env.listId,
//   method: "post",
//   headers: {
//     "authorization": "tony1 "+process.env.apiKey
//   },
//   body: jsonData
// };

//   request(options, function(error, response, body) {
//     if (error) {
//       res.sendFile(__dirname + "/failure.html");
//     } else {
//       if (response.statusCode === 200) {
//         res.sendFile(__dirname + "/success.html");
//       } else {
//         res.sendFile(__dirname + "/failure.html");
//       }
//     }
//   });
});
//
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//Port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});