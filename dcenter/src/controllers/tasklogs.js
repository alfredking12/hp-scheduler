var moment = require('moment');
var TaskLogs = require('../models/tasklogs');
var util = require('../libs/util');
var db = require('../libs/db');
var config = require('../config/config');

module.exports = {
    getList: function(req,res,next) {

        var page = util.toInt(req.params.page, 0);
        var per_page = util.toInt(req.params.per_page, 25);
        var key = req.params.key;
        var stime = util.toInt(req.params.stime);
        var etime = util.toInt(req.params.etime);

        if (per_page > config.max_page_size) per_page = config.max_page_size;

        //TODO: 支持关键字模糊查询
        //TODO: 支持日期范围查询

        var start = page * per_page;
        var end = start + per_page;

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
