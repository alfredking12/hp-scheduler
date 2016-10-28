module.exports = {
    
    db_connection_string: "mysql://dev:" + encodeURIComponent('Bysun4321$#@!') + "@pre.mysql.local:3306/hp_scheduler_pre",
    db_pool_max: 20,
    db_pool_min: 0,
    db_pool_idle: 10000,

    rabbitmq_url: 'amqp://mquser:Bysun@pre.rabbitmq.local:5672',

    dispatcher_center_callback: '__dispatcher_center_callback.pre',

    max_page_size: 200,

    log_sql: false,
    log_simpleformat: true,

    max_backlog: 7,//tasklogs和taskrecords保留最近7天数据
}