var TaskLogs = require('../controllers/tasklogs');

module.exports = function route(server) {
    server.get('/tasklogs', TaskLogs.getList);
}
