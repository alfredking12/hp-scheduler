var schedule = require('node-schedule');
var parser = require('cron-parser');
var Tasks = require('../models/tasks');
var Log = require('./log');

function scheduler() {
    if (!(this instanceof scheduler)) {
        return new TaskCenter();
    }
    
    this.triggers = {};

    this.init = function(triggers) {
        for (var i=0;i<triggers.length;i++) {
            this.add(triggers[i]);
        }
    }

    this.update = function(trigger) {
        if (!this.validate(trigger))
            return;
        
        var item = this.triggers["trigger_" + trigger.id];
        if (!item) {
            Log.e(new Error("错误提示: trigger not fount"));
            return;
        }

        this.unschedule(trigger);
        item.trigger = trigger;
        //TODO: v0.0.2 重复次数
        //item.repeated = 0;
        item.schedule = this.schedule(trigger);
        item.live = (item.schedule != null);
    }

    this.add = function(trigger) {
        if (!this.validate(trigger))
            return;
        
        var item = this.triggers[ "trigger_" + trigger.id];
        if (item) {
            Log.e(new Error("错误提示: trigger not fount"));
            return;
        }

        var item = {
            trigger: trigger,
            schedule: this.schedule(trigger),
            //TODO: v0.0.2 重复次数
            //repeated: 0
        };

        item.live = (item.schedule != null);

        this.triggers["trigger_" + trigger.id] = item;
    },

    this.remove = function(trigger) {
        this.unschedule(trigger);
        var item = this.triggers["trigger_" + trigger.id];
        if (item) {
            delete item;
        } 
    },

    this.validate = function(trigger) {
        if (trigger.type == 0) {
            try {
                var interval = parseInt(trigger.value);
            } catch (error) {
                Log.e(error);
                return false;
            }
        } else {
            try {
                var interval = parser.parseExpression(trigger.value);
            } catch (error) {
                Log.e(error);
                return false;
            }
        }
        return true;
    }

    this.schedule = function(trigger) {

        var _this = this;

        var ret = _this.expired(trigger);
        if (ret > 0) {
            return null;
        }
        
        var looper = {};

        if (trigger.type == 0) {                // --- Interval
            //根据开始时间设置setTimeout时间参数
            var t = 0;
            if (trigger.stime > 0) {
                var now = new Date().getTime();
                if (now < trigger.stime) {
                    t = trigger.stime - now;
                }
            }

            looper.timeout = setTimeout(function(){
                looper.timeout = 0;

                ret = _this.expired(trigger);
                if (ret > 0) {
                    _this.unschedule(trigger);
                } else {
                    if (ret == 0) {
                        _this.trigger_tasks(trigger);
                    }
                    looper.interval = setInterval(function(){

                        ret = _this.expired(trigger);

                        if (ret == 0) {
                            _this.trigger_tasks(trigger);
                        } else if (ret > 0) {
                            _this.unschedule(trigger);
                        } else {
                            //waiting
                        }
                    }, parseInt(trigger.value) * 1000);
                }
            }, t);

        } else /* if (trigger.type == 0) */ {   // --- Cron
            
            var options = {rule : trigger.value};
            if (trigger.stime != 0) {
                options.start = new Date(trigger.stime);
            }
            if (trigger.etime != 0) {
                options.end = new Date(trigger.etime);
            }

            looper.timeout = setTimeout(function(){
                looper.timeout = 0;

                looper.job = schedule.scheduleJob(options, function() {
                    if (!_this.expired(trigger)) {
                        _this.trigger_tasks(trigger);
                    } else {
                        _this.unschedule(trigger);
                    }
                });
            }, 0);
        }

        return looper;
    }

    this.unschedule = function(trigger) {
        var item = this.triggers["trigger_" + trigger.id];
        if (!item) {
            Log.e(new Error("错误提示: trigger not fount"));
            return;
        }

        if (item.schedule) {
            if (item.schedule.job) {
                item.schedule.job.cancel();
            }
            if (item.schedule.timeout) {
                clearTimeout(item.schedule.timeout);
            }
            if (item.schedule.interval) {
                clearInterval(item.schedule.interval);
            }
        }
        item.live = false;
    }

    this.trigger_tasks = function(trigger) {
        var _this = this;

        var item = this.triggers["trigger_" + trigger.id];
        if (!item) {
            Log.e(new Error("错误提示: trigger not fount"));
            return;
        }

        //TODO: v0.0.2 重复次数
        //item.repeated = item.repeated || 0;
        //item.repeated ++;

        //读取数据库任务触发任务
        Tasks.define()
            .findAll({
                where: {
                    trigger_code: trigger.code
                }
            })
            .then(function(data){
                if (data.length > 0) {
                    for (var i=0;i<data.length;i++) {
                        _this.run(data[i]);
                    }
                }
                else {
                    Log.d("SCHEDULER::: " + JSON.stringify(trigger));
                }
            })
            .catch(function(err){
                Log.e("执行触发器任务失败(获取任务列表失败):" + trigger.code, err);
            });
    }

    //=0 可以执行
    //<0 待执行
    //>0 已执行完
    this.expired = function(trigger) {
        var now = new Date().getTime();

        if (trigger.stime != 0) {
            if (now < trigger.stime)
                return -1;
        }
        if (trigger.etime != 0) {
            if (now > trigger.etime)
                return 1;
        }
        /*
        //TODO: v0.0.2 重复次数
        if (trigger.repeat != 0) {
            var item = this.triggers["trigger_" + trigger.id];
            if (item && item.repeated >= trigger.repeat)
                return 1;
        }
        */
        return 0;
    }

    this.run = function(task) {
        //TODO:
        Log.i("SCHEDULER::: " + JSON.stringify(trigger));
    }
}

//TODO: v0.0.2 重复次数
//1. Task需增加repeat，且需更新repeat字段
//2. 考虑repeat到达上线后，如何重置

module.exports = new scheduler();
