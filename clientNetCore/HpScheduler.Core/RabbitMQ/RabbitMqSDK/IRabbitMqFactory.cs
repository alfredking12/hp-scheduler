namespace HpScheduler.Core.RabbitMQ.RabbiMqSDK
{
    public interface IRabbitMqFactory
    {
        IRabbitMqConnection CreateConnection();

    }

}
