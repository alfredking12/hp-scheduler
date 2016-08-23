
var dcenter = require('./libs/dcenter.js');
var Log = require('./libs/log.js');

process.on('uncaughtException', function(err) {
    Log.e('### UncaughtException:' + err.stack);
});

var server = dcenter.createServer(
    require('./routers/tasks'),
    require('./routers/triggers'),
    require('./routers/taskrecords'),
    require('./routers/tasklogs')
);

server.listen(process.env.PORT || 9001, function(){
    console.log('listening', server.name, server.url);
});
