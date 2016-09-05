using HpScheduler.Core.RabbitMQ.RabbiMqSDK;
using RabbitMQ.Client.Events;
using System.Text;

namespace HpScheduler.Core.RabbitMQ.RabbitMqScene.WorkQueue
{
    internal class WorkQueueConsumer : IMQConsumer
    {
        private IRabbitMqChannel mChannel = null;
        private IRabbitMqConnection mConnection = null;
        private string mQueueName = null;
        private EventingBasicConsumer mConsumer = null;

        //TODO:判断连接失败
        public static WorkQueueConsumer createInstance(IRabbitMqFactory factory, string queueName)
        {
            WorkQueueConsumer instance = new WorkQueueConsumer();
            instance.mConnection = factory.CreateConnection();
            instance.mChannel = instance.mConnection.CreateChannel();
            instance.mQueueName = queueName;
            instance.mChannel.QueueDeclare(queue: instance.mQueueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            instance.mConsumer = instance.mChannel.GetEventingBasicConsumer();
            return instance;
        }

        public void ReceivedMessage(OnMessage callback)
        {
            mConsumer.Received += (model, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body);

                callback(ea.DeliveryTag, message);
            };

            mChannel.BasicConsume(queue: mQueueName, noack: false, consumer: mConsumer);
        }

        public void Ack(ulong deliveryTag)
        {
            mChannel.BasicAck(deliveryTag: deliveryTag, multiple: false);
        }

        public void NAck(ulong deliveryTag, bool requeue = true)
        {
            mChannel.BasicNack(deliveryTag: deliveryTag, multiple: false, requeue: requeue);
        }

        public void Dispose()
        {
            mChannel.Dispose();
            mConnection.Dispose();
        }


    }
}
