var TaskLogs = require('../models/tasklogs');
var util = require('../libs/util');

module.exports = {
    getList: function(req,res,next) {
        TaskLogs.define()
            .findAll({
                order: [
                    ['updatedAt', 'DESC'],
                ]
            }).then(function (data) {
                util.ok(req, res, next, data);
            }).catch(next);
    }
}
