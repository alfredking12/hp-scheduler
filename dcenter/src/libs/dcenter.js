var restify = require('restify');
var Log = require('./log.js');
var ReqCtx = require('./reqctx.js');
var scheduler = require('./scheduler');

var dcenter = {

    createServer: function () {

        var server = restify.createServer({
            formatters: {
                'application/json': api_exit
            }
        });
        server.use(api_entry);
        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        support_cors(restify, server); 

        var routers = [];

        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            routers = routers.concat(arg);
        }

        for (var i = 0; i < routers.length; i++) {
            var router = routers[i];
            if (router) {
                try {
                    router(server);
                } catch (e) {
                    Log.e("Index:" + i + ", router load failed", e);
                }
            }
            else {
                Log.e("Index:" + i + ", router load failed");
            }
        }

        scheduler.init();

        return server;
    },

}

module.exports = dcenter;

function api_exit(req, res, body, next) {
    Log.log_exist(req, body);

    if (body instanceof Error) {
        body = { ret: 500, msg: body.message };
    } else if (Buffer.isBuffer(body)) {
        body = body.toString('base64');
    }
    var data = JSON.stringify(body);
    res.setHeader('Content-Length', Buffer.byteLength(data));
    return next(null, data);
}

function api_entry(req, res, next) {
    res.charSet("utf-8");
    ReqCtx.bind(req);
    Log.log_entry(req);
    next();
}

function support_cors(restify, server) {

    server.use(restify.CORS());

    server.on('MethodNotAllowed', function cors_handler(req, res) {
        if (req.method.toLowerCase() === 'options') {

            if (res.methods.indexOf('OPTIONS') === -1)
                res.methods.push('OPTIONS');

            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            return res.send(204);
        }
        else {
            res.charSet("utf-8");
            return res.send(new Error("不支持该方法"));
        }
    });
}