var amqp = require('amqplib');
var config = require('../config/config');
var Log = require('./log');
var when = require('when');

var MQ = {

    send: function(q, msg, cb) {
        amqp.connect(config.rabbitmq_url).then(function(conn) {
            Log.i(" [" + q + "] connected.");
            return conn.createChannel().then(function(ch) {
                Log.i(" [" + q + "] created channel.");
                return ch.assertQueue(q, {
                        durable: true
                    }).then(function(ok){
                        Log.i(" [" + q + "] sending message:" + msg);
                        return ch.sendToQueue(q, new Buffer(msg), {persistent: true});
                    }).then(function(){
                        Log.i(" [" + q + "] sent message:" + msg);
                        cb();
                    })
            }).ensure(function(){ setTimeout(function(){conn.close();}, 0) })
        }).then(null, function(err){
            Log.i("[" + q + "]: 发送消息异常", err);
            cb(err);
        }).catch(function(err){

        });
    },

    recv: function(q, cb) {

        amqp.connect(config.rabbitmq_url).then(function(conn) {
            process.once('SIGINT', function() { conn.close(); });
            Log.i(" [" + q + "] connected.");

            return conn.createChannel().then(function(ch) {
                    Log.i(" [" + q + "] created channel.");
                    return ch.assertQueue(q, {durable: true})
                        .then(function(ok){
                            ch.prefetch(1);
                            return ch.consume(q, function(msg) {
                                var m = msg.content.toString();
                                Log.i("[ " + q + "] recv message: " + m);
                                cb(m);
                                ch.ack(msg);
                            }, {noAck: false});
                        });
            })
        }).then(null, console.warn);
    }
}

module.exports = MQ;
