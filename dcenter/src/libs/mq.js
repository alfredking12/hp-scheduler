var amqp = require('amqplib/callback_api');
var config = require('../config/config');
var Log = require('./log');

var MQ = {

    send: function(routeKey, msgs, cb) {
        if (!Array.isArray(msgs)) {
            msgs = [msgs];
        }

        amqp.connect(config.rabbitmq_url, function(err, conn) {
            
            if (err) {
                Log.i("send: 连接MQ失败");
                cb && cb(err);
                return ;
            }

            Log.i("send: 连接MQ成功");

            conn.createChannel(function(err, ch) {
                
                if (err) {
                    Log.i("send: 连接管道失败");
                    conn.close();
                    cb && cb(err);
                    return ;
                }

                Log.i("send: 连接管道成功");
                
                var q = routeKey;
                ch.assertQueue(q, {durable: true});
                for(var i=0;i<msgs.length;i++) {
                    var msg = msgs[i];
                    ch.sendToQueue(q, new Buffer(msg), {persistent: true});
                    Log.i(" [" + q + "] Sent " + msg);
                }

                cb && cb();
                //conn.close();
            });
        });
    },

    recv: function(routeKey, cb) {

        amqp.connect(config.rabbitmq_url, function(err, conn) {
            
            if (err) {
                Log.i("recv: 连接MQ失败");
                return ;
            }

            Log.i("recv: 连接MQ成功");

            conn.createChannel(function(err, ch) {
                    
                if (err) {
                    Log.i("recv: 连接管道失败");
                    return ;
                }

                Log.i("recv: 连接管道成功");
                
                var q = routeKey;
                ch.assertQueue(q, {durable: true});
                ch.prefetch(1);
                ch.consume(q, function(msg) {
                    var m = msg.content.toString();
                    Log.i("[ " + q + "] Recv " + m);
                    cb(m);
                    ch.ack(msg);
                }, {noAck: false});
            });
        });
    }
}

module.exports = MQ;
