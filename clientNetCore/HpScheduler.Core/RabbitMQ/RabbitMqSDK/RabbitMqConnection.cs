using RabbitMQ.Client;

namespace HpScheduler.Core.RabbitMQ.RabbiMqSDK
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
