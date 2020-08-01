//jshint esversion:6

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true});

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Why no name?"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFruit: fruitSchema
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const Person = mongoose.model("Person", personSchema);

const pineapple = new Fruit({
  name: "Pineapple",
  rating: 8,
  review: "Great fruit."
});

pineapple.save();

const person = new Person({
  name: "Tony",
  age: 30,
  favoriteFruit: pineapple
});

person.save();


// const fruit = new Fruit ({
//   name: "Apple",
//   rating: 9,
//   review: "Pretty solid as a fruit."
// });
//
// fruit.save();
//
// const kiwi = new Fruit({
//   name: "Kiwi",
//   rating: 10,
//   review: "The best fruit!"
// });
//
// const orange = new Fruit({
//   name: "Orange",
//   rating: 4,
//   review: "Too sour for me"
// });
//
// const banana = new Fruit({
//   name: "Banana",
//   rating: 3,
//   review: "Weird texture"
// });
//
// Fruit.insertMany([kiwi, orange, banana], function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved all the fruits to fruitsDB");
//   }
// });

Fruit.find(function(err, fruits){
  if (err) {
    console.log(err);
  } else {

    mongoose.connection.close();

    fruits.forEach(function(fruit) {
      console.log(fruit.name);
    })
  }
});

Fruit.deleteOne({_id:"5f24521b2f6773421634066e"}, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully deleted the document.");
  }
});