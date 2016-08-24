var Tasks = require('../models/tasks');
var Triggers = require('../models/triggers');
var util = require('../libs/util');
var db = require('../libs/db');
var scheduler = require('../libs/scheduler');

module.exports = {

    getList: function(req,res,next) {

        //var promise = db.select("select Tasks.id, Tasks.name, Tasks.disable, Tasks.trigger_code, Triggers.type, Triggers.value, Triggers.stime, Triggers.etime, Triggers.repeat from Tasks join Triggers on Tasks.triggers_code = Triggers.code order by Tasks.updatedAt DESC", {});
        var promise = Tasks.define().findAll({order: [ ['updatedAt', 'DESC'] ]});

        promise.then(function (data) {
                var ret = [];
                for (var i=0;i<data.length;i++) {
                    var item = data[i];

                    var task = {
                        id: item.id,
                        name: item.name,
                        trigger_code: item.trigger_code,
                        disable: item.disable,
                    };

                    //TODO: v0.0.2 任务状态
                    // var trigger = {
                    //     type: item.type,
                    //     value: item.value,
                    //     stime: item.stime,
                    //     etime: item.etime,
                    //     repeat: item.repeat,
                    // }

                    var obj = {
                        id: item.id,
                        name: item.name,
                        trigger_code: item.trigger_code,
                        //TODO: v0.0.2 任务状态
                        status: "",
                        disable: item.disable
                    };
                    ret.push(obj);
                }
                util.ok(req, res, next, ret);
            }).catch(next);
    },

    addItem: function(req,res,next) {
        var data = req.body;

        Triggers
            .define()
            .findOne({
                code: data.trigger_code
            })
            .then(function(trigger){
                if (trigger == null) {
                    util.fail(req, res, next, "触发器标识不存在");
                } else {
                    return Tasks.define().create(data);
                }
            })
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
        
        if (data.id !== undefined)
            delete data.id;

        if (data.name !== undefined)
            delete data.name;


        var TaskModel = Tasks.define();
        var promise = null;

        if (data.trigger_code) {

            promise = Triggers
                .define()
                .findOne({
                    code: data.trigger_code
                })
                .then(function(trigger){
                    if (trigger == null) {
                        util.fail(req, res, next, "触发器标识不存在");
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
    },

    disableItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.define()
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
            .catch(next);
    },

    enableItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.define()
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
            .catch(next);
    },

    //执行一次性任务
    runOnceItem: function(req,res,next) {
        var id = req.params.id;

        Tasks.define()
            .findById(id)
            .then(function (data) {
                if (data) {
                    scheduler.run(data);
                    util.ok(req, res, next, data);
                }
                else {
                    util.fail(req, res, next, "任务不存在");
                }
            })
            .catch(next);
    }
}
