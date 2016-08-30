using HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue
{
    internal class WorkQueueProducer : IMQProducer
    {
        private IRabbitMqChannel mChannel = null;
        private IRabbitMqConnection mConnection = null;

        //TODO:判断连接失败
        public static WorkQueueProducer createInstance(IRabbitMqFactory factory)
        {
            WorkQueueProducer instance = new WorkQueueProducer();
            instance.mConnection = factory.CreateConnection();
            instance.mChannel = instance.mConnection.CreateChannel();
            return instance;
        }

        public void sendMessage(string routingKey, string msg)
        {
            var queName = routingKey;
            mChannel.QueueDeclare(queue: queName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var body = Encoding.UTF8.GetBytes(msg);
            mChannel.BasicPublish("", queName, null, body);
        }

        public void Dispose()
        {
            mChannel.Dispose();
            mConnection.Dispose();
        }
        
    }
}
