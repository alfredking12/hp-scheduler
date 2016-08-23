var Tasks = require('../controllers/tasks');

module.exports = function route(server) {
    server.get('/tasks', Tasks.getList);
    server.post('/tasks', Tasks.addItem);
    server.get('/tasks/:id', Tasks.getItem);
    server.put('/tasks/:id', Tasks.updateItem);
    server.del('/tasks/:id', Tasks.deleteItem);
}