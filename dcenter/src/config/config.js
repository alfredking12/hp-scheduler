module.exports = {
    
    db_connection_string: "mysql://dev:" + encodeURIComponent('Bysun4321$#@!') + "@120.26.239.94:3306/hp_scheduler",
    db_pool_max: 2,
    db_pool_min: 0,
    db_pool_idle: 10000,

    rabbitmq_url: 'amqp://mquser:Bysun@120.26.242.51:5672',

    dispatcher_center_callback: '__dispatcher_center_callback.local',

    max_page_size: 200,
}