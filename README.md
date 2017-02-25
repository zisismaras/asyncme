# AsyncMe
##### Turn blocking code to asynchronous functions
[![npm version](https://badge.fury.io/js/asyncme.svg)](https://badge.fury.io/js/asyncme)  
#### Usage
```javascript
const asyncme = require("asyncme")({poolSize: 1, disposable: true});

asyncme.run(function(start) {
    //blocking code
    for (var i=0; i<=100000000; i++) {
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

console.log("I am unblocked!");
```

#### Options
`poolSize` How many workers to spawn. Defaults to cpu core count. Pass `0` for none.  
`disposable` Kill each worker as soon as its work is completed. Defaults to `false`
#### Methods
`run(task<function>, [...args]) => <Promise>`  
Pass a function with the blocking code plus any optional arguments.  
Always return the result from inside the function.  
`spawn([count=1]<Number>) => <asyncMeInstance>`  
Add workers on demand. Defaults to `1`. Returns the instance.  
`exit() => <Promise>`  
Gracefully kill all the workers when their work is completed. The promise is resolved when all the workers have been killed.
`exitNow() => <Promise>`  
Immediately kill all the workers without waiting. The promise is resolved when all the workers have been killed.  
#### Properties
`_workers`  
The internal pool of workers (child processes).  
#### Examples
There are many examples in the `examples` folder showing many possible situations like running parallel tasks, throwing errors, killing the workers and limitations.
#### Notes
The workers are child processes spawned with [process.fork()](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) and the communication is made using standard node process messaging.  
The task functions are serialized and then executed on the child process using the [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) which will practically `eval()` the function, so keep that in mind and don't pass unsafe code.  
Tested on the current node LTS (v6.9.5). Uses many es6 features so older node versions might not work.  
#### Limitations
Doesn't work on the browser.  
Can't use `require()` inside the tasks.  
External scope is not transfered.  
Asynchronous code won't be properly handled (the promise will resolve and/or the worker might be dead before it is completed).  
Check the `examples/wontWork.js`
#### License
MIT