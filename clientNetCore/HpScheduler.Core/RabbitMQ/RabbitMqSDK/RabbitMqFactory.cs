using RabbitMQ.Client;

namespace HpScheduler.Core.RabbitMQ.RabbiMqSDK
{
    public class RabbitMqFactory : IRabbitMqFactory
    {
        private ConnectionFactory mConnectionFactory = null;

        public RabbitMqFactory(string hostName, string userName, string passWord)
        {
            mConnectionFactory = new ConnectionFactory();
            mConnectionFactory.HostName = hostName;
            mConnectionFactory.UserName = userName;
            mConnectionFactory.Password = passWord;
            mConnectionFactory.AutomaticRecoveryEnabled = true;
        }

        public RabbitMqFactory(string uri)
        {
            mConnectionFactory = new ConnectionFactory();
            mConnectionFactory.Uri = uri;
            mConnectionFactory.AutomaticRecoveryEnabled = true;
        }

        public IRabbitMqConnection CreateConnection()
        {
            return new RabbitMqConnection(mConnectionFactory);
        }

    }
}
