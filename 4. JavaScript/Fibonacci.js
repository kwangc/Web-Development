function fibonacciGenerator(n) {
    var fibonacci = [];
    for(var i = 0; i < n; i++) {
        if(i < 2) {
            fibonacci.push(i);
        } else {
            fibonacci.push(fibonacci[i-1]+fibonacci[i-2]);
        }
    }
    return fibonacci;
}
