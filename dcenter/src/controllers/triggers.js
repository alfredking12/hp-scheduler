var Triggers = require('../models/triggers');
var util = require('../libs/util');

module.exports = {

    // 获取触发器列表
    getList: function (req, res, next) {
        Triggers.define()
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

        Triggers.define()
            .create(data)
            .then(function (data) {
                util.ok(req, res, next, data);
            })
            .catch(next);
    },

    //获取触发器对象
    getItem: function (req, res, next) {
        var id = req.params.id;

        Triggers.define()
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
        
        console.log("update", {id: id, data: data});

        if (data.id !== undefined)
            delete data.id;

        if (data.name !== undefined)
            delete data.name;

        if (data.code !== undefined)
            delete data.code;

        var TriggerModel = Triggers.define();
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
            })
            .catch(next);
    },

    //删除触发器
    deleteItem: function (req, res, next) {
        var id = req.params.id;

        Triggers.define()
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

    //根据触发器标识获取触发器对象
    getItemWithCode: function (req, res, next) {
        var code = req.params.code;

        Triggers.define()
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
