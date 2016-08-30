using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene
{

    public interface IMQConsumer : IDisposable
    {
        void ReceivedMessage(string routingKey, EventHandler<BasicDeliverEventArgs> callback);

    }
}
