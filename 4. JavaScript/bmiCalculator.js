//Create your function below this line

function bmiCalculator(weight, height) {
  var myBmi = weight / (Math.pow(height,2));
  return Math.round(myBmi);
}

var bmi = bmiCalculator(75, 1.87);
console.log(bmi);

/* If my weight is 65kg and my height is 1.8m, I should be able to call your function like this:

var bmi = bmiCalculator(65, 1.8);

bmi should equal around 20 in this case.

*/
