var TaskRecords = require('../controllers/taskrecords');

module.exports = function route(server) {
    server.get('/taskrecords', TaskRecords.getList);
    server.get('/taskrecords/:id', TaskRecords.getItem);
}