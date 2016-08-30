using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client;

namespace HpSchedulerJob.NET.RabbitMq
{
    public class RabbitMqManagerClient : IRabbitMqManagerClient
    {
        private ConnectionFactory factory = null;
        private IConnection consumerConnection = null;
        private IConnection publishConnection = null;
        private IConnection mConnection = null;

        public RabbitMqManagerClient(string hostName, string userName, string passWord)
        {
            factory = new ConnectionFactory();
            factory.HostName = hostName;
            factory.UserName = userName;
            factory.Password = passWord;
        }

        public RabbitMqManagerClient(string uri)
        {
            factory = new ConnectionFactory();
            factory.Uri = uri;
        }

        public IModel CreateConsumerChannel()
        {
            return consumerConnection.CreateModel();
        }

        public IConnection CreateConsumerConnection()
        {
            consumerConnection = factory.CreateConnection();
            return consumerConnection;
        }

        public IModel CreatePublishChannel()
        {
            return publishConnection.CreateModel();
        }

        public IConnection CreatePublishConnection()
        {
            publishConnection = factory.CreateConnection();
            return publishConnection;
        }

        public IConnection CreateConnection()
        {
            mConnection = factory.CreateConnection();
            return mConnection;
        }

        public IModel CreateChannel()
        {
            return mConnection.CreateModel();
        }

        public void Dispose()
        {
            consumerConnection?.Dispose();
            publishConnection?.Dispose();
            mConnection?.Dispose();
        }
    }
}
