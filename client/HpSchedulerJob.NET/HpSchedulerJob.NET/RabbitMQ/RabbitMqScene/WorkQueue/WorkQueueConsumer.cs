using HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK;
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
        private IRabbitMqChannel mChannel = null;
        private IRabbitMqConnection mConnection = null;

        //TODO:判断连接失败
        public static WorkQueueConsumer createInstance(IRabbitMqFactory factory)
        {
            WorkQueueConsumer instance = new WorkQueueConsumer();
            instance.mConnection = factory.CreateConnection();
            instance.mChannel = instance.mConnection.CreateChannel();
            return instance;
        }

        public void ReceivedMessage(string routingKey, OnMessage callback)
        {
            var queName = routingKey;
            mChannel.QueueDeclare(queue: queName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = mChannel.GetEventingBasicConsumer();
            consumer.Received += (model, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body);

                callback(message);

                mChannel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };

            mChannel.BasicConsume(queue: queName, noack: false, consumer: consumer);
        }

        public void Dispose()
        {
            mChannel.Dispose();
            mConnection.Dispose();
        }


    }
}
