var Triggers = require('../controllers/triggers');

module.exports = function route(server) {
    server.get('/triggers', Triggers.getList);
    server.post('/triggers', Triggers.addItem);
    server.get('/triggers/:id', Triggers.getItem);
    server.put('/triggers/:id', Triggers.updateItem);
    server.del('/triggers/:id', Triggers.deleteItem);
    //TODO: v0.0.2 暂时没用
    //server.get('/triggers/code/:code', Triggers.getItemWithCode);
}
