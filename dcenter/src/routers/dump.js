var Dump = require('../controllers/dump');

module.exports = function route(server) {
    server.get('/dump', Dump.dump);
}
