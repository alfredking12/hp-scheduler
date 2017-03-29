using HpSchedulerJob.NET.RabbitMq;
using RabbitMQ.Client;

namespace HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK
{
    internal class RabbitMqConnection : IRabbitMqConnection
    {
        private IConnection mConnection = null;

        internal RabbitMqConnection(IConnection connection)
        {
            this.mConnection = connection;
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
