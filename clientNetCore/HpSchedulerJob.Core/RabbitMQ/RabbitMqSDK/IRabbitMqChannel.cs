using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq
{
    public interface IRabbitMqChannel : IDisposable
    {
        /// <summary>
        /// 队列声明
        /// </summary>
        /// <param name="queue"></param>
        /// <param name="durable"></param>
        /// <param name="exclusive"></param>
        /// <param name="autoDelete"></param>
        /// <param name="arguments"></param>
        void QueueDeclare(string queue, bool durable, bool exclusive, bool autoDelete, IDictionary<string, object> arguments = null);

        /// <summary>
        /// 交换器声明
        /// </summary>
        /// <param name="exchange"></param>
        /// <param name="type"></param>
        void ExchangeDeclare(string exchange, string type);

        /// <summary>
        /// 绑定消息队列和交换器
        /// </summary>
        /// <param name="queue"></param>
        /// <param name="exchange"></param>
        /// <param name="routingkey"></param>
        void QueueBind(string queue, string exchange, string routingkey);

        /// <summary>
        /// 公平分发
        /// </summary>
        /// <param name="prefetchsize"></param>
        /// <param name="prefetchcount"></param>
        /// <param name="global"></param>
        void BasicQos(uint prefetchsize, ushort prefetchcount, bool global);

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="exchange"></param>
        /// <param name="routingKey"></param>
        /// <param name="basicProperties"></param>
        /// <param name="body"></param>
        void BasicPublish(string exchange, string routingKey, IBasicProperties basicProperties, byte[] body);

        /// <summary>
        /// 用来释放资源
        /// </summary>
        /// <param name="queue"></param>
        /// <param name="noack"></param>
        /// <param name="consumer"></param>
        /// <returns></returns>
        string BasicConsume(string queue, bool noack, IBasicConsumer consumer);

        /// <summary>
        /// Consumer监听绑定事件
        /// </summary>
        /// <returns></returns>
        EventingBasicConsumer GetEventingBasicConsumer();

        /// <summary>
        /// 消息回执(应答)
        /// </summary>
        /// <param name="deliveryTag"></param>
        /// <param name="multiple"></param>
        void BasicAck(ulong deliveryTag, bool multiple);

        /// <summary>
        /// 消息回执(应答)
        /// </summary>
        /// <param name="deliveryTag"></param>
        /// <param name="multiple"></param>
        /// <param name="requeue"></param>
        void BasicNack(ulong deliveryTag, bool multiple, bool requeue = true);

    }
}
