using HpSchedulerJob.NET.RabbitMq;
using RabbitMQ.Client;

namespace HpSchedulerJob.NET.RabbitMQ.RabbiMqSDK
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
