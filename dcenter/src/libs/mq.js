var amqp = require('amqplib');
var config = require('../config/config');
var Log = require('./log');
var when = require('when');

var MQ = {

    send: function(q, msg) {
        return amqp.connect(config.rabbitmq_url).then(function cb_send_connect(conn) {
            Log.i(" [" + q + "] connected.");
            return conn.createChannel()
                .then(function cb_send_createChannel(ch) {
                    Log.i(" [" + q + "] created channel.");
                    return ch.assertQueue(q, {
                            durable: true
                        }).then(function cb_send_assertQueue(ok){
                            Log.i(" [" + q + "] sending message:" + msg);
                            return ch.sendToQueue(q, new Buffer(msg), {persistent: true});
                        }).then(function cb_send(){
                            Log.i(" [" + q + "] sent message:" + msg);
                        })
                }).ensure(function cb_send_ensure(){ 
                    Log.i('closed connection.');
                    setTimeout(function cb_send_close(){conn.close();}, 0);
                })
        });
    },

    recv: function(q, cb) {
        var _this = this;

        amqp.connect(config.rabbitmq_url).then(function cb_recv_connect(conn) {
            Log.i(" [" + q + "] connected.");

            conn.on('error', function cb_recv_onError(err) {
                Log.i('MQ connection error:' + err);
                setTimeout(function re_connect(){
                    _this.recv(q, cb);
                }, 5000);
            });

            return conn.createChannel().then(function cb_recv_createChannel(ch) {
                    Log.i(" [" + q + "] created channel.");
                    return ch.assertQueue(q, {durable: true})
                        .then(function cb_recv_assertQueue(ok){
                            ch.prefetch(1);
                            return ch.consume(q, function cb_consume(msg) {
                                var m = msg.content.toString();
                                Log.i("[ " + q + "] recv message: " + m);

                                cb({
                                    message: m,
                                    ack: function() {
                                        ch.ack(msg);
                                    },
                                    nack: function() {
                                        ch.nack(msg);
                                    }
                                });
                            }, {noAck: false});
                        });
            })
        }).catch(function cb_recv_catch(err){
            Log.w('MQ connection exception:', err);
            setTimeout(function re_connect(){
                _this.recv(q, cb);
            }, 5000);
        }).done();
    }
}

module.exports = MQ;
