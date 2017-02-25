const asyncme = require("../index")();

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

console.log("Let's finish the work and exit.");
asyncme.exit().then(function() {
    console.log("bye");
});