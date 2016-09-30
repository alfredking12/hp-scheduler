namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene
{
    public interface IMQFactory
    {
        IMQProducer CreateMqProducer(string routingKey);
        IMQConsumer CreateMqConsumer(string routingKey);

    }
}
