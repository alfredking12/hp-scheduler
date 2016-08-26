var Tasks = require('../controllers/tasks');

module.exports = function route(server) {
    server.get('/tasks', Tasks.getList);
    server.post('/tasks', Tasks.addItem);
    server.get('/tasks/:id', Tasks.getItem);
    server.put('/tasks/:id', Tasks.updateItem);
    
    server.del('/tasks/:id', Tasks.deleteItem);

    server.put('/tasks/disable/:id', Tasks.disableItem);
    server.put('/tasks/enable/:id', Tasks.enableItem);
    server.post('/tasks/run_once/:id', Tasks.runOnceItem);
}