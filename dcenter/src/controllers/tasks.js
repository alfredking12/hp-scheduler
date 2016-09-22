var Tasks = require('../models/tasks');
var Triggers = require('../models/triggers');
var util = require('../libs/util');
var db = require('../libs/db');
var scheduler = require('../libs/scheduler');
var Log = require('../libs/log');

//TODO: 优化错误提示

module.exports = {

    getList: function(req,res,next) {

        Tasks
            .model()
            .findAll({order: [ ['updatedAt', 'DESC'] ]})
            .then(function (data) {
                util.ok(req, res, next, data);
            })
            .catch(next)
            .done();
    },

    addItem: function(req,res,next) {
        var data = req.body;

        Triggers
            .model()
            .findOne({
                where: {
                    code: data.trigger_code
                }
            })
            .then(function cb_findOne_trigger(trigger){
                Log.i("addItem find trigger: " + JSON.stringify(trigger));
                if (trigger == null) {
                    return Promise.reject(new Error("触发器标识不存在"));
                } else {
                    return Tasks.model().create(data);
                }
            })
            .then(function (data) {
                util.ok(req, res, next, data);
            })
            .catch(next)
            .done();
    },

    getItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.model()
            .findById(id)
            .then(function (data) {
                if (data)
                    util.ok(req, res, next, data);
                else
                    return Promise.reject(new Error("任务不存在"));
            })
            .catch(next)
            .done();
    },

    updateItem: function(req,res,next) {
        var id = req.params.id;
        var data = req.body;
        
        if (data.id !== undefined)
            delete data.id;

        if (data.name !== undefined)
            delete data.name;

        var TaskModel = Tasks.model();
        var promise = null;

        if (data.trigger_code) {

            promise = Triggers
                .model()
                .findOne({
                    where: {
                        code: data.trigger_code
                    }
                })
                .then(function cb_findOne_trigger2(trigger){
                    if (trigger == null) {
                        return Promise.reject(new Error("触发器标识不存在"));
                    } else {
                        return TaskModel.update(data, {where: {id: id}});
                    }
                })
                
        } else {
            promise = TaskModel.update(data, {where: {id: id}});
        }

        promise
            .then(function (data) {
                if (data && data[0])
                    return TaskModel.findById(id)
                else
                    return Promise.reject(new Error("更新失败"))
            })
            .then(function (data) {
                util.ok(req, res, next, data);
            })
            .catch(next)
            .done();
    },

    deleteItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.model()
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

    disableItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.model()
            .update({
                disable: true
            }, {
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

    enableItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.model()
            .update({
                disable: false
            }, {
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

    //执行一次性任务
    runOnceItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.model()
            .findById(id)
            .then(function (data) {
                if (data) {
                    scheduler.run(data);
                    util.ok(req, res, next, data);
                }
                else {
                    return Promise.reject(new Error("任务不存在"));
                }
            })
            .catch(next)
            .done();
    }
}
