var TaskRecords = require('../models/taskrecords');
var util = require('../libs/util');

module.exports = {

    getList: function(req,res,next) {
        
        var page = req.params.page || 0;
        var per_page = req.params.per_page || 25;
        var key = req.params.key;
        var stime = req.params.stime;
        var etime = req.params.etime;

        var options = {
            order: [
                ['updatedAt', 'DESC'],
            ],
            offset: page * per_page,
            limit: per_page
        }

        TaskRecords.define()
            .findAll(options).then(function (data) {
                util.ok(req, res, next, data);
            }).catch(next);
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
