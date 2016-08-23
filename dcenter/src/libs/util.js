module.exports = {
    ok: function(data, req, res, next) {
        res.send({
            ret: 0, 
            msg: "success",
            data: data 
        });
        next();
    }
}
