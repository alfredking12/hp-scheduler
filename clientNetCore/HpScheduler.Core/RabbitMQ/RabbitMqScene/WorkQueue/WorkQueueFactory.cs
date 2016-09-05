using HpScheduler.Core.RabbitMQ.RabbiMqSDK;

namespace HpScheduler.Core.RabbitMQ.RabbitMqScene.WorkQueue
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
