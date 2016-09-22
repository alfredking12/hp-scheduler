var util = require('../libs/util');
var Log = require('../libs/log');
var heapdump = require('heapdump');

module.exports = {
    dump: function(req,res,next) {
        heapdump.writeSnapshot(function cb_dump(err, filename) {
            if (err) Log.e("dump failed", err);
            else Log.i('dump written to ' + filename);
        });
        return util.ok(req, res, next);
    }
}
