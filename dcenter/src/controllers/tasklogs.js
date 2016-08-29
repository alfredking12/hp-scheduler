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
        var task_record_id = req.params.recordid;

        if (per_page > config.max_page_size) per_page = config.max_page_size;

        var whereSql = [];
        var bind = {};

        if (!task_record_id) {
            if (key) {
                whereSql.push('(tasks.name like $key or message like $key)');
                bind.key = '%' + key + '%';
            }

            if (stime) {
                whereSql.push('tasklogs.time >= $stime');
                bind.stime = stime;
            }

            if (etime) {
                whereSql.push('tasklogs.time < $etime');
                bind.etime = etime;
            }
        } else {
            whereSql.push('taskrecords.id = $task_record_id');
            bind.task_record_id = task_record_id;
        }

        if (whereSql.length) {
            whereSql = ' where ' + whereSql.join(' AND ');
        } else {
            whereSql = '';
            bind = null
        }

        var start = page * per_page;
        var end = start + per_page;

        var sql = "select tasklogs.*, tasks.name from tasklogs inner join taskrecords on tasklogs.taskrecord_id=taskrecords.id inner join tasks on taskrecords.task_id=tasks.id " + whereSql + " order by tasklogs.time desc LIMIT " + start + "," + per_page;
        var sql_count = "select count(*) AS count from tasklogs inner join taskrecords on tasklogs.taskrecord_id=taskrecords.id inner join tasks on taskrecords.task_id=tasks.id " + whereSql;
        var options = bind ? {bind: bind} : {};

        db.select(sql_count, options)
            .then(function(cnt){
                var cnt = cnt[0].count;
                if (cnt < start) {
                    return util.ok(req, res, next, {data: [], count: 0});    
                } else {
                    req.cnt = cnt;
                    return db.select(sql, options);
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
