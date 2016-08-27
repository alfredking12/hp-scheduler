module.exports = {

    db_connection_string: "mysql://localhost:3306/hp_scheduler",
    db_pool_max: 2,
    db_pool_min: 0,
    db_pool_idle: 10000,

    rabbitmq_url: 'amqp://localhost:5672',

    max_page_size: 200,
}
