const asyncme = require("../index")({poolSize: 2, disposable: true});

asyncme.run(function(start) {
    for(var i=0; i<=100000000; i++) {
        start += i;
    }
    return start;
}, 10)
.then(function(result) {
    console.log("total 1:", result);
})
.catch(function(err) {
    console.error(err);
});

console.log("This will be printed first!");

asyncme.run(function(start) {
    for(var i=0; i<=100000000; i++) {
        start += i;
    }
    return start;
}, 10)
.then(function(result) {
    console.log("total 2:", result);
})
.catch(function(err) {
    console.error(err);
});

console.log("This will be printed second!");