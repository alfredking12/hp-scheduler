var TaskRecords = require('../models/taskrecords');
var util = require('../libs/util');

module.exports = {

    getList: function(req,res,next) {
        TaskRecords.define()
            .findAll({
                order: [
                    ['updatedAt', 'DESC'],
                ]
            }).then(function (data) {
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
