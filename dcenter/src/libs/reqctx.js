var uuid = require('node-uuid');

var ReqCtx = {

    Ctx: function(req) {
        if (!(this instanceof ReqCtx.Ctx))
            return new ReqCtx.Ctx(req);

        if (req) {
            this.id = uuid.v4();
            this.name = req.url;
            this.stime = new Date().getTime();
        }
    },

    bind: function(req, sequelize) {
        req.ctx = ReqCtx.Ctx(req);
        req.sequelize = sequelize;
    },

    get: function(req) {
        try {
            return req.ctx;
        } catch (error) {
            return ReqCtx.Ctx();
        }
    }
}

module.exports = ReqCtx;