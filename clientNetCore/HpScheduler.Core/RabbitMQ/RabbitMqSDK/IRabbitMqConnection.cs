using System;

namespace HpScheduler.Core.RabbitMQ.RabbiMqSDK
{
    public interface IRabbitMqConnection : IDisposable
    {
        IRabbitMqChannel CreateChannel();
    }
}
