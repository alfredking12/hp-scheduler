using HpScheduler.Core.RabbitMQ.RabbiMqSDK;
using System.Text;

namespace HpScheduler.Core.RabbitMQ.RabbitMqScene.WorkQueue
{
    internal class WorkQueueProducer : IMQProducer
    {
        private IRabbitMqChannel mChannel = null;
        private IRabbitMqConnection mConnection = null;
        private string mQueueName = null;

        //TODO:判断连接失败
        public static WorkQueueProducer createInstance(IRabbitMqFactory factory, string queueName)
        {
            WorkQueueProducer instance = new WorkQueueProducer();
            instance.mConnection = factory.CreateConnection();
            instance.mChannel = instance.mConnection.CreateChannel();
            instance.mQueueName = queueName;
            return instance;
        }

        public void sendMessage(string msg)
        {
            mChannel.QueueDeclare(queue: mQueueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var body = Encoding.UTF8.GetBytes(msg);
            mChannel.BasicPublish("", mQueueName, null, body);
        }

        public void Dispose()
        {
            mChannel.Dispose();
            mConnection.Dispose();
        }
        
    }
}
