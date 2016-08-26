var uuid = require('node-uuid');

var ReqCtx = {

    Ctx: function(req) {
        if (!(this instanceof ReqCtx.Ctx))
            return new ReqCtx.Ctx(req);

        this.id = uuid.v4();
        this.stime = new Date().getTime();
        this.name = "";
        
        if (req) {
            this.name = req.method + " " + req.url;
        }
    },

    bind: function(req, sequelize) {
        req.ctx = ReqCtx.Ctx(req);
        req.sequelize = sequelize;
    },

    get: function(req) {
        if (!req || !req.ctx)
            return ReqCtx.Ctx();
        
        return req.ctx;
    }
}

module.exports = ReqCtx;