const asyncme = require("../index")();

//this will never run
asyncme.run(function(start) {
    for(var i=0; i<=100000000; i++) {
        start += i;
    }
    return start;
}, 10)
.then(function(result) {
    console.log("total:", result);
})
.catch(function(err) {
    console.error(err);
});

console.log("exit now!");
asyncme.exitNow().then(function() {
    console.log("ok...");
});