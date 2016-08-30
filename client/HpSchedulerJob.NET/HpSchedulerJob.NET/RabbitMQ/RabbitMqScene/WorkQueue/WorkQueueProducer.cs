using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue
{
    internal class WorkQueueProducer : IMQProducer
    {
        private IRabbitMqClient mClient = null;

        private string mRabbitMqUrl = string.Empty;

        public WorkQueueProducer(IRabbtMqManagerProxy proxy)
        {
            this.mClient = proxy.GetRabbitMqClient();
        }

        public void Dispose()
        {
            this.mClient.Dispose();
        }

        public void sendMessage(string routingKey, string msg)
        {
            var queName = routingKey;

            mClient.QueueDeclare(queue: queName, durable: true, exclusive: false, autoDelete: false, arguments: null);

            var body = Encoding.UTF8.GetBytes(msg);

            mClient.BasicPublish("", queName, null, body);


        }
    }
}
