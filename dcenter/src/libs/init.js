var db = require('../libs/db');
var Triggers = require('../models/triggers');
var TaskLogs = require('../models/tasklogs');
var Tasks = require('../models/tasks');
var TaskRecords = require('../models/taskrecords');

module.exports = {
    init: function() {
        Triggers.define();
        Tasks.define();
        TaskLogs.define();
        TaskRecords.define();
        db.sync({force: false});
    },

    reset: function() {
        Triggers.define();
        Tasks.define();
        TaskLogs.define();
        TaskRecords.define();
        db.sync({force: true});
    }
}