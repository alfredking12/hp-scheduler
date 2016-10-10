using HpSchedulerJob.NET.RabbitMq;
using RabbitMQ.Client;
using System;

namespace HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK
{
    public interface IRabbitMqConnection : IDisposable
    {
        IRabbitMqChannel CreateChannel();
    }
}
