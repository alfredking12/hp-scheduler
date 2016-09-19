var Sequelize = require("sequelize");
var db = require('../libs/db');

var model_decl = ["triggers", {

    // 自增ID
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

    // 触发器名称
    name: {type: Sequelize.STRING, allowNull: false, unique: true},

    // 触发器标识
    code: {type: Sequelize.STRING, allowNull: false, unique: true},

    // 开始时间
    stime: { type: Sequelize.BIGINT(13), allowNull: false, defaultValue: 0},

    // 结束时间
    etime: { type: Sequelize.BIGINT(13), allowNull: false, defaultValue: 0},

    // 最大触发次数
    repeat: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},

    // 触发器类型: 0-普通触发器 1-cron触发器
    type: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},

    // 触发器配置值：普通触发器value为时间间隔（秒），cron触发器value为cron表达式
    value: {type: Sequelize.STRING, allowNull: false},
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
