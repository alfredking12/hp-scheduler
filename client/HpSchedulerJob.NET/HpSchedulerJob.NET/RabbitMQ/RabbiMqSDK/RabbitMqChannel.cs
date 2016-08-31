using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Collections.Generic;
using System;

namespace HpSchedulerJob.NET.RabbitMq
{
    internal class RabbitMqChannel : IRabbitMqChannel
    {

        private IModel mChannel;

        internal RabbitMqChannel(IModel Channel)
        {
            this.mChannel = Channel;
        }


        public string BasicConsume(string queue, bool noack, IBasicConsumer consumer)
        {
            return mChannel.BasicConsume(queue, noack, consumer);
        }

        public void BasicPublish(string exchange, string routingKey, IBasicProperties basicProperties, byte[] body)
        {
            mChannel.BasicPublish(exchange, routingKey, basicProperties, body);
        }

        public void BasicQos(uint prefetchsize, ushort prefetchcount, bool global)
        {
            mChannel.BasicQos(prefetchsize, prefetchcount, global);
        }

        public void ExchangeDeclare(string exchange, string type)
        {
            mChannel.ExchangeDeclare(exchange, type);
        }

        public EventingBasicConsumer GetEventingBasicConsumer()
        {
            return new EventingBasicConsumer(this.mChannel);
        }

        public void QueueBind(string queue, string exchange, string routingkey)
        {
            mChannel.QueueBind(queue, exchange, routingkey);
        }

        public void QueueDeclare(string queue, bool durable, bool exclusive, bool autoDelete, IDictionary<string, object> arguments = null)
        {
            mChannel.QueueDeclare(queue, durable, exclusive, autoDelete, arguments);
        }


        public void BasicAck(ulong deliveryTag, bool multiple)
        {
            mChannel.BasicAck(deliveryTag, multiple);
        }

        public void Dispose()
        {
            mChannel.Dispose();
        }

    }
}
