using HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK;
using System;
namespace HpSchedulerJob.NET.RabbitMq
{
    public interface IRabbitMqFactory
    {
        IRabbitMqConnection CreateConnection();

    }

}
