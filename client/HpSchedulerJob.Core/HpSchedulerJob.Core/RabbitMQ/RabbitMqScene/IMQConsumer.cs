using System;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene
{

    public delegate void OnMessage(ulong deliveryTag, string message);

    public interface IMQConsumer : IDisposable
    {
        void ReceivedMessage(OnMessage callback);

        void Ack(ulong deliveryTag);

        void NAck(ulong deliverTag, bool requeue = true);
    }
}
