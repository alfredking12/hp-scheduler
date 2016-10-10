var TaskRecords = require('../models/taskrecords');
var util = require('../libs/util');
var config = require('../config/config');
var moment = require('moment');
var Log = require('../libs/log');

module.exports = {

    getList: function(req,res,next) {
        
        var page = util.toInt(req.params.page, 0);
        var per_page = util.toInt(req.params.per_page, 25);
        var key = req.params.key;
        var stime = util.toInt(req.params.stime);
        var etime = util.toInt(req.params.etime);
        var status = util.toInt(req.params.status, -1);

        if (per_page > config.max_page_size) per_page = config.max_page_size;

        var options = {
            order: [
                ['updatedAt', 'DESC'],
            ],
            offset: page * per_page,
            limit: per_page
        }

        var cond = null;

        if (key !== null && key !== undefined && (key + '').trim().length != 0) {
            cond = cond || {};
            Object.assign(cond, {
                name: {
                    $like: '%' + key + '%'
                }
            });
        } 

        if (stime) {
            cond = cond || {};
            Object.assign(cond, {
                stime: {
                    $gte: stime
                }
            });         
        }
        
        if (etime) {
            cond = cond || {};
            cond.stime = cond.stime || {};
            Object.assign(cond.stime, {
                $lt: etime
            });         
        }

        if (status != -1) {
            cond = cond || {};
            Object.assign(cond, {
                status: status
            });
        }

        if (cond) {
            options.where = cond;
        } 

        Log.d('options:' + JSON.stringify(options));

        var TaskRecordModel = TaskRecords.model();
        TaskRecordModel.count(cond ? {where: cond} : {})
            .then(function cb_count_of_taskrecord(cnt){
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
                        var updatedAt = item.updatedAt ? moment.utc(item.updatedAt).format('YYYY-MM-DD HH:mm:ss.SSS') : '';
                        item.setDataValue('updatedAt', updatedAt);
                        var createdAt = item.createdAt ? moment.utc(item.createdAt).format('YYYY-MM-DD HH:mm:ss.SSS') : '';
                        item.setDataValue('createdAt', createdAt);
                        item.stime = item.stime ? moment(item.stime).format('YYYY-MM-DD HH:mm:ss.SSS') : '';
                        item.etime = item.etime ? moment(item.etime).format('YYYY-MM-DD HH:mm:ss.SSS') : '';
                    });
                    util.ok(req, res, next, {count: req.cnt, data: data});
                }
            })
            .catch(next)
            .done();
    },

    getItem: function(req,res,next) {
        var id = req.params.id;

        TaskRecords.model()
            .findById(id)
            .then(function (data) {
                if (data)
                    util.ok(req, res, next, data);
                else
                    return Promise.reject(new Error("任务记录不存在"));
            })
            .catch(next)
            .done();
    },

    //删除触发器
    deleteItem: function (req, res, next) {
        var id = req.params.id;

        TaskRecords.model()
            .destroy({
                where: {
                    id: id
                }
            })
            .then(function (count) {
                util.ok(req, res, next);
            })
            .catch(next)
            .done();
    },
}
