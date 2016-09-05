using System;

namespace HpScheduler.Core.RabbitMQ.RabbitMqScene
{
    public interface IMQProducer : IDisposable
    {
        void sendMessage(string msg);

    }
}
