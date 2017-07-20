var p = Promise.resolve('promised value').then(function() {
throw new Error('error');
});
var p = p.then(function(){ return 'OK';});
var p = p.then(function(){ return 'OK';});
//any number of chains
p.then(
function(r){console.log('done: ', r);},
function(e){console.log('an error happened: ', e);}
);
