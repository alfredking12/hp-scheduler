var Triggers = require('../models/triggers');
var util = require('../libs/util');

module.exports = {

    getList: function (req, res, next) {
        var TriggerModel = Triggers.define();

        TriggerModel.findAll({
            order: [
                ['updatedAt', 'DESC'],
            ]
        }).then(function (data) {
            util.ok(data, req, res, next);
        }).catch(next);
    },

    addItem: function (req, res, next) {

    },
    getItem: function (req, res, next) {

    },
    updateItem: function (req, res, next) {

    },
    deleteItem: function (req, res, next) {

    },
    getItemWithCode: function (req, res, next) {

    }
}
