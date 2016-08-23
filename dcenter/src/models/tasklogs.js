var Sequelize = require("sequelize");
var db = require('../libs/db');

var model_decl = ["tasklogs", {

    // 自增ID
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

    // 任务流水表主键
    taskrecord_id: { type: Sequelize.STRING, allowNull: false },

    // 时间
    time: { type: Sequelize.BIGINT(13), allowNull: false},

    // 日志消息
    message: {type: Sequelize.STRING, allowNull: false, defaultValue: ''},

    // 进度 (<0 失败, >=0 进度)
    progress: { type: Sequelize.INTEGER}
}];

module.exports = {
    define: function() {
        var sequelize = db.sequelize();
        return sequelize.define(model_decl[0], model_decl[1], {
            freezeTableName: true // Model tableName will be the same as the model name
        });
    }
}
