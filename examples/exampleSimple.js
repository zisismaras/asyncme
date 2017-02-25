const asyncme = require("../index")({poolSize: 1, disposable: true});

asyncme.run(function(start) {
    for(var i=0; i<=100000000; i++) {
        start += i;
    }
    return start; //always return the result
}, 10) //that's how you pass parameters
.then(function(result) {
    console.log("total:", result);
})
.catch(function(err) {
    console.error(err);
});

console.log("This will be printed first!");