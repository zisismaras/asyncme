const childProcess = require("child_process");
const os = require("os");

module.exports = function(options = {poolSize: os.cpus().length, disposable: false}) {
    let workers = [];
    for (let i = 1; i <= options.poolSize; i++) {
        workers.push(childProcess.fork(__dirname + "/worker"));
    }
    return {
        run: function(task, ...args) {
            return new Promise(function(resolve, reject) {
                if (workers.length === 0) {
                    reject(new Error("asyncme: no worker alive"));
                }
                let worker = minWorker(workers);
                if (!worker.connected) {
                    reject(new Error("asyncme: cannot connect to worker"));
                }
                worker.send({type: "work", task: task.toString(), args: args});
                worker.on("message", function(msg) {
                    if (msg.type === "workResult") {
                        let workResult = msg.result;
                        if (workResult.error) {
                            reject(new Error(workResult.error));
                        } else {
                            resolve(workResult.result);
                        }
                        if (options.disposable) {
                            let index = workers.indexOf(worker);
                            worker.send({type: "exitGracefully"});
                            workers.splice(index, 1);
                        }
                    }
                });
            });
        },
        exit: function() {
            return new Promise(function(resolve, reject) {
                let exitedCount = 0;
                let totalWorkers = workers.length;
                workers.forEach(worker => {
                    worker.send({type: "exitGracefully"});
                    worker.on("message", function(msg) {
                        if (msg.type === "exitedGracefully") {
                            exitedCount +=1;
                            let index = workers.indexOf(worker);
                            workers.splice(index, 1);
                            if (exitedCount === totalWorkers) {
                                resolve();
                            }
                        }
                    });
                });
            });
        },
        exitNow: function() {
            return new Promise(function(resolve, reject) {
                let exitedCount = 0;
                let totalWorkers = workers.length;
                workers.forEach(worker => {
                    worker.send({type: "exitNow"});
                    worker.on("message", function(msg) {
                        if (msg.type === "exitedNow") {
                            exitedCount +=1;
                            let index = workers.indexOf(worker);
                            workers.splice(index, 1);
                            if (exitedCount === totalWorkers) {
                                resolve();
                            }
                        }
                    });
                });
            });
        },
        spawn: function(count = 1) {
            for (let i = 1; i <= count; i++) {
                workers.push(childProcess.fork(__dirname + "/worker"));
            }
            return this;
        },
        _workers: workers
    }
};

function minWorker(workers) {
    let min = Number.MAX_SAFE_INTEGER;
    let theOne;
    workers.forEach(worker => {
        if (worker._eventsCount < min) {
            min = worker._eventsCount;
            theOne = worker;
        }
    });
    return theOne;
}