using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue
{
    public class WorkQueueFactory : IMQFactory
    {

        private string mRabbimqUri;

        private  IRabbitMqClient mClient = null;

        private  IRabbtMqManagerProxy mRabbitMqManagerProxy = null;

        public WorkQueueFactory(string rabbitmquri)
        {
            this.mRabbimqUri = rabbitmquri;
            this.mRabbitMqManagerProxy = RabbitMqSdk.GetMqClient(rabbitmquri);
            this.mClient = this.mRabbitMqManagerProxy.GetRabbitMqClient();
        }

        public IMQConsumer CreateMqConsumer()
        {
            return (IMQConsumer)(new WorkQueueConsumer(this.mRabbitMqManagerProxy));
        }

        public IMQProducer CreateMqProducer()
        {
            return (IMQProducer)(new WorkQueueProducer(this.mRabbitMqManagerProxy));
        }

        public void Dispose()
        {
            mRabbitMqManagerProxy?.Dispose();
        }
    }
}
