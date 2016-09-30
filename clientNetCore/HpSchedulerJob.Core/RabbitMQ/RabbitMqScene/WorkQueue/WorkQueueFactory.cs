using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue
{
    public class WorkQueueFactory : RabbitMqFactory, IMQFactory
    {
        public WorkQueueFactory(string hostName, string userName, string passWord) : base(hostName, userName, passWord)
        {
        }

        public WorkQueueFactory(string uri) : base(uri)
        {
        }

        public IMQConsumer CreateMqConsumer(string routingKey)
        {
            return (IMQConsumer)(WorkQueueConsumer.createInstance(this, routingKey));
        }

        public IMQProducer CreateMqProducer(string routingKey)
        {
            return (IMQProducer)(WorkQueueProducer.createInstance(this, routingKey));
        }
    }
}
