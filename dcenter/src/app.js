
var dcenter = require('./libs/dcenter.js');
var Log = require('./libs/log.js');

process.on('uncaughtException', function(err) {
    Log.e('### UncaughtException:' + err.stack);
});

var server = dcenter.createServer(
    require('lodash').values(require('require-dir')('./routers'))
);

server.listen(process.env.PORT || 9001, function(){
    Log.i('listening:' + server.name + ' '+ server.url);
});
