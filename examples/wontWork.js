const asyncme = require("../index")({poolSize: 1, disposable: true});

var a = 5;

asyncme.run(function() {
    console.log(a); //a is not available here
    const fs = require("fs"); //can't require files
})
.catch(function(err) {
    console.error("here you go:", err);
});