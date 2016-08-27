var TaskRecords = require('../models/taskrecords');
var util = require('../libs/util');
var config = require('../config/config');
var moment = require('moment');

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

        var options = {
            order: [
                ['updatedAt', 'DESC'],
            ],
            offset: page * per_page,
            limit: per_page
        }

        var TaskRecordModel = TaskRecords.define();
        TaskRecordModel.count({})
            .then(function(cnt){
                if (cnt < page * per_page) {
                    return util.ok(req, res, next, {data: [], count: 0});    
                } else {
                    req.cnt = cnt;
                    
                    return TaskRecordModel.findAll(options);
                }
            })
            .then(function (data) {
                if (data) {
                    data.map(function(item, index){
                        var spent = item.etime ? ((item.etime - item.stime) + 'ms') : '-';
                        item.setDataValue('spent', spent);
                        item.stime = item.stime ? moment(item.stime).format('YYYY-MM-DD HH:mm:ss.SSS') : '';
                        item.etime = item.etime ? moment(item.etime).format('YYYY-MM-DD HH:mm:ss.SSS') : '';
                    });
                    util.ok(req, res, next, {count: req.cnt, data: data});
                }
            })
            .catch(next);
    },

    getItem: function(req,res,next) {
        var id = req.params.id;

        TaskRecords.define()
            .findById(id)
            .then(function (data) {
                if (data)
                    util.ok(req, res, next, data);
                else
                    util.fail(req, res, next, "任务记录不存在");
            })
            .catch(next);
    }
}
