var Tasks = require('../models/tasks');
var util = require('../libs/util');

module.exports = {

    getList: function(req,res,next) {
        Tasks.define()
            .findAll({
                order: [
                    ['updatedAt', 'DESC'],
                ]
            }).then(function (data) {
                util.ok(req, res, next, data);
            }).catch(next);
    },

    addItem: function(req,res,next) {
        var data = req.body;

        Tasks.define()
            .create(data)
            .then(function (data) {
                util.ok(req, res, next, data);
            })
            .catch(next);
    },

    getItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.define()
            .findById(id)
            .then(function (data) {
                if (data)
                    util.ok(req, res, next, data);
                else
                    util.fail(req, res, next, "任务不存在");
            })
            .catch(next);
    },

    updateItem: function(req,res,next) {
        var id = req.params.id;
        var data = req.body;
        
        console.log("update", {id: id, data: data});

        if (data.id !== undefined)
            delete data.id;

        if (data.name !== undefined)
            delete data.name;

        var TaskModel = Tasks.define();
        TaskModel
            .update(data, {
                where: {
                    id: id
                }
            })
            .then(function (data) {
                if (data && data[0])
                    return TaskModel.findById(id)
                else
                    util.fail(req, res, next, "更新失败");
            })
            .then(function (data) {
                util.ok(req, res, next, data);
            })
            .catch(next);
    },

    deleteItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.define()
            .destroy({
                where: {
                    id: id
                }
            })
            .then(function (count) {
                util.ok(req, res, next);
            })
            .catch(next);
    }
}
