const asyncme = require("../index")({poolSize: 0, disposable: true});//0 workers on init

//spawn 1 worker and then run
asyncme.spawn().run(function(start) {
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
console.log("This will be printed first!");