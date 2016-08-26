var moment = require('moment');
var TaskLogs = require('../models/tasklogs');
var util = require('../libs/util');
var db = require('../libs/db');

module.exports = {
    getList: function(req,res,next) {

        var page = req.params.page || 0;
        var per_page = req.params.per_page || 25;
        var key = req.params.key;
        var stime = req.params.stime;
        var etime = req.params.etime;

        //TODO: 分页参数校验

        var start = page * per_page;
        var end = start + per_page;
        var cnt = 0;

        TaskLogs.define().count({})
            .then(function(cnt){
                if (cnt < start) {
                    return util.ok(req, res, next, {data: [], count: 0});    
                } else {
                    req.cnt = cnt;
                    return db.select("select tasklogs.*, tasks.name from tasklogs inner join taskrecords on tasklogs.taskrecord_id=taskrecords.id inner join tasks on taskrecords.task_id=tasks.id order by tasklogs.time desc LIMIT " + start + "," + per_page);
                }
            })
            .then(function (data) {
                if (data) {
                    data.map(function(item, index){
                        item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss.SSS');
                    });
                    util.ok(req, res, next, {count: req.cnt, data: data});
                }
            })
            .catch(next);
    }
}
