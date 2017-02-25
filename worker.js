let workQueue = [];
let working = false;
let exitGracefully = false;

setInterval(function() {
    if (!working && workQueue.length > 0) {
        working = true;
        workQueue.shift()();
        working = false;
    }
    if (!working && exitGracefully === true && workQueue.length === 0) {
        process.send({type: "exitedGracefully"});
        process.exit(0);
    }
});

process.on("message", function(msg) {
    switch (msg.type) {
        case "work":
            workQueue.push(function() {
                let func = new Function("args", `return (${msg.task})(...args)`);
                let result;
                try {
                    result = {result: func(msg.args)};
                } catch(e) {
                    result = {error: e.toString()};
                }
                process.send({type: "workResult", result: result});
            });
            break;
        case "exitGracefully":
            exitGracefully = true;
            break;
        case "exitNow":
            process.send({type: "exitedNow"});
            process.exit(1);
            break;
    }

});