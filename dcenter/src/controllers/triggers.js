var Triggers = require('../models/triggers');
var util = require('../libs/util');
var scheduler = require('../libs/scheduler');

//TODO: 优化错误提示

module.exports = {

    // 获取触发器列表
    getList: function (req, res, next) {
        Triggers.model()
            .findAll({
                order: [
                    ['updatedAt', 'DESC'],
                ]
            }).then(function (data) {
                util.ok(req, res, next, data);
            }).catch(next);
    },

    //新建触发器
    addItem: function (req, res, next) {
        var data = req.body;

        //TODO: v0.0.2 重复次数（需删除下面2行代码）        
        if (data.repeat !== undefined)
            delete data.repeat;

        if (!scheduler.validate(data)) {
            util.fail(req, res, next, "触发器设置参数不正确");
            return;
        }

        Triggers.model()
            .create(data)
            .then(function (data) {
                util.ok(req, res, next, data);
                scheduler.add(data);
            })
            .catch(next);
    },

    //获取触发器对象
    getItem: function (req, res, next) {
        var id = req.params.id;

        Triggers.model()
            .findById(id)
            .then(function (data) {
                if (data)
                    util.ok(req, res, next, data);
                else
                    util.fail(req, res, next, "触发器不存在");
            })
            .catch(next);
    },

    //更新触发器
    updateItem: function (req, res, next) {

        var id = req.params.id;
        var data = req.body;
        
        if (data.id !== undefined)
            delete data.id;

        if (data.name !== undefined)
            delete data.name;

        if (data.code !== undefined)
            delete data.code;

        //TODO: v0.0.2 重复次数（需删除下面2行代码）        
        if (data.repeat !== undefined)
            delete data.repeat;

        if ((data.type !== null && data.type !== undefined) || (data.value !== null && data.value !== undefined)) {
            if (!scheduler.validate(data)) {
                util.fail(req, res, next, "触发器设置参数不正确");
                return;
            }
        }

        var TriggerModel = Triggers.model();
        TriggerModel
            .update(data, {
                where: {
                    id: id
                }
            })
            .then(function (data) {
                if (data && data[0])
                    return TriggerModel.findById(id)
                else
                    util.fail(req, res, next, "更新失败");
            })
            .then(function (data) {
                util.ok(req, res, next, data);
                scheduler.update(data);
            })
            .catch(next);
    },

    //删除触发器
    deleteItem: function (req, res, next) {
        var id = req.params.id;

        Triggers.model()
            .destroy({
                where: {
                    id: id
                }
            })
            .then(function (count) {
                util.ok(req, res, next);
                scheduler.remove(data);
            })
            .catch(next);
    },

    //根据触发器标识获取触发器对象
    getItemWithCode: function (req, res, next) {
        var code = req.params.code;

        Triggers.model()
            .findOne({
                where: {
                    code: code
                }
            })
            .then(function (data) {
                if (data)
                    util.ok(req, res, next, data);
                else
                    util.fail(req, res, next, "触发器不存在");
            })
            .catch(next);
    }
}
