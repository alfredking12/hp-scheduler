var restify = require('restify');
var Log = require('./log.js');
var ReqCtx = require('./reqctx.js');

var db = require('../libs/db');
var Triggers = require('../models/triggers');
var TaskLogs = require('../models/tasklogs');
var Tasks = require('../models/tasks');
var TaskRecords = require('../models/taskrecords');

var scheduler = require('./scheduler');

var MQ = require('./mq');

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

        for (var i = 0; i < arguments.length; i++) {
            var m = arguments[i];
            if (m) {
                try {
                    m(server);
                } catch (e) {
                    Log.e("Index:" + i + ", router load failed", e);
                }
            }
            else {
                Log.e("Index:" + i + ", router load failed");
            }
        }

        dcenter.init();

        return server;
    },

    init: function() {
        var TriggerModel = Triggers.define();
        Tasks.define();
        TaskLogs.define();
        TaskRecords.define();
        db.sync({force: false});

        var i = 0;
        setInterval(function(){
            if (i > 100) return;            
            MQ.send("demo", [JSON.stringify({
                taskid: '41b572eb-b221-4dc0-9da9-7ff91c5c3824' + (i++)
            })]);
        }, 3000);

        MQ.recv("__dispatcher_center_callback", function(msg) {

            //TODO: 写入TaskLogs
            //TODO: 更新任务记录状态

            /*
                var data = JSON.parse(msg);
                data.taskid;
                data.message;
                data.time;
                data.progress;
            */
        });


        // scheduler.add({
        //     id: "",
        //     name: "轮询间隔5分钟触发",
        //     code: "AXV0B1A5",
        //     stime: 0,
        //     etime: 0,
        //     //TODO: v0.0.2 重复次数
        //     //repeat: 0,
        //     type: 1,
        //     value: "*/3 * * * * *"
        // });

        TriggerModel
            .findAll()
            .then(function(data){
                scheduler.init(data);
            })
            .catch(function(err){
                Log.e(err);
                process.exit(1);
            });
    },

    reset: function() {
        Triggers.define();
        Tasks.define();
        TaskLogs.define();
        TaskRecords.define();
        db.sync({force: true});
    }
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