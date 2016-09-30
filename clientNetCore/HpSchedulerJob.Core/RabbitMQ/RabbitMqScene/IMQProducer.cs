using System;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene
{
    public interface IMQProducer : IDisposable
    {
        void sendMessage(string msg);

    }
}
