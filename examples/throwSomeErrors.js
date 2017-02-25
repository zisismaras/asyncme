const asyncme = require("../index")({poolSize: 1, disposable: true});

asyncme.run(function() {
    throw "oh no";
    console.log("i will never run");
})
.catch(function(err) {
    console.error("Got it!", err); //catch it
});