using HpSchedulerJob.NET.RabbitMq;
using RabbitMQ.Client;
using System;

namespace HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK
{
    internal class RabbitMqConnection : IRabbitMqConnection
    {
        private IConnection mConnection = null;

        internal RabbitMqConnection(IConnectionFactory factory)
        {
            this.mConnection = factory.CreateConnection();
        }

        public IRabbitMqChannel CreateChannel()
        {
            return new RabbitMqChannel(mConnection.CreateModel());
        }

        public void Dispose()
        {
            mConnection.Dispose();
        }
    }
}
