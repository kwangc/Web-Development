function beer() {

  for (var count = 99; count >= 0; count--) {
    var nextCount = count - 1;
    if (count === 2) {
      console.log(count + " bottles of beer on the wall, " + count + " bottles of beer. Take 1 down, pass it around, 1 bottle of beer on the wall.");
    } else if (count === 1) {
      console.log(count + " bottle of beer on the wall, " + count + " bottle of beer. Take 1 down, pass it around, no more bottle of beer on the wall.");
    } else if (count === 0) {
      console.log("No more bottles of beer on the wall, no more bottles of beer. Go to the store and buy some more, 99 bottles of beer on the wall.");
    } else {
      console.log(count + " bottles of beer on the wall, " + count + " bottles of beer. Take 1 down, pass it around, " + nextCount + " bottles of beer on the wall.");
    }

  }

}
