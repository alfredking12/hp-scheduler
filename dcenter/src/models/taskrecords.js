var Sequelize = require("sequelize");
var db = require('../libs/db');

var model_decl = ["taskrecords", {

    // GUID
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

    // 任务表主键
    task_id: { type: Sequelize.INTEGER, allowNull: false },

    // 任务名称
    name: {type: Sequelize.STRING, allowNull: false},

    // 任务描述
    detail: {type: Sequelize.STRING, allowNull: false, defaultValue: ''},

    // 任务描述
    param: {type: Sequelize.STRING, allowNull: false, defaultValue: ''},

    // 触发器标识
    trigger_code: {type: Sequelize.STRING, allowNull: false},

    // 任务类型：0-MQ类型任务 1-RESTful类型任务（暂不支持）
    type: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},

    // 任务目标。MQ类型的任务taget标识任务MQ key，以后支持的RESTful类型任务target标识URL（多个URL可用;分隔）
    target: { type: Sequelize.STRING, allowNull: false, defaultValue: ''},

    // 开始时间
    stime: { type: Sequelize.BIGINT(13)},

    // 结束时间
    etime: { type: Sequelize.BIGINT(13)},

    // 进度
    progress: { type: Sequelize.INTEGER },

    // 状态：0-未开始 1-执行中 2-执行成功 3-执行失败 4-执行超时(暂不支持)
    status: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}
}];

module.exports = {
    define: function() {
        var sequelize = db.sequelize();
        return sequelize.define(model_decl[0], model_decl[1], {
            freezeTableName: true // Model tableName will be the same as the model name
        });
    },

    model: function() {
        var sequelize = db.sequelize();
        return sequelize.model(model_decl[0]);
    }
}
