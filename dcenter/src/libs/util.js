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
    },

    toInt: function(value, defaultValue) {
        
        if (value === 0) return value;

        if (value !== 0 && !value) {
            console.log('defaultValue:' + defaultValue);
            return defaultValue;
        }

        if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
            return Number(value);

        return defaultValue;
    }
}
