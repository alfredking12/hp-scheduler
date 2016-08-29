using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue
{
    internal class WorkQueueConsumer : IMQConsumer 
    {
        private string mRabbitMqUrl = string.Empty;

        private IRabbitMqClient mClient = null;

        public WorkQueueConsumer(IRabbtMqManagerProxy proxy)
        {
            this.mClient = proxy.GetRabbitMqClient();
        }

        public void ReceivedMessage(string routingKey, EventHandler<BasicDeliverEventArgs> callback)
        {
            var queName = routingKey;

            mClient.QueueDeclare(queue: queName, durable: true, exclusive: false, autoDelete: false, arguments: null);

            var consumer = mClient.GetEventingBasicConsumer();

            consumer.Received += callback;

            mClient.BasicConsume(queue: queName, noack: true, consumer: consumer);
        }

        public void Dispose()
        {
            this.mClient.Dispose();
        }
    }
}
