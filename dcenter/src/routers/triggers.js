var Triggers = require('../controllers/triggers');

module.exports = function route(server) {
    server.get('/triggers', Triggers.getList);
    server.post('/triggers', Triggers.addItem);
    server.get('/triggers/:id', Triggers.getItem);
    server.put('/triggers/:id', Triggers.updateItem);
    server.del('/triggers/:id', Triggers.deleteItem);
    server.get('/triggers/code/:code', Triggers.getItemWithCode);
}
