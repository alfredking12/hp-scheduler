namespace HpScheduler.Core.RabbitMQ.RabbitMqScene
{
    public interface IMQFactory
    {
        IMQProducer CreateMqProducer(string routingKey);
        IMQConsumer CreateMqConsumer(string routingKey);

    }
}
