module.exports = {
    ok: function(req, res, next, data) {
        var msg = {
            ret: 0, 
            msg: "success"
        };
        if (data) msg.data = data;
        res.send(msg);
        next();
    },
    
    fail: function(req, res, next, msg, code) {
        res.send({
            ret: code || 1, 
            msg: msg
        });
        next();
    }
}
