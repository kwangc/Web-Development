function whosPaying(names) {

/******Don't change the code above*******/

    //Write your code here.
    var randomNumber = Math.random()*names.length;
    var payer = names[Math.floor(randomNumber)];

  return payer + " is going to buy lunch today!";
/******Don't change the code below*******/
}

whosPaying(["Angela","Ben","Jenny","Michael","Chloe"])
