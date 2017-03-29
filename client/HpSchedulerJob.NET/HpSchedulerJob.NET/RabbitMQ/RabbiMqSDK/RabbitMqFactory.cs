using HpSchedulerJob.NET.Foundation;
using HpSchedulerJob.NET.RabbitMq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;

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
            mConnectionFactory.AutomaticRecoveryEnabled = true;
        }

        public RabbitMqFactory(string uri)
        {
            mConnectionFactory = new ConnectionFactory();
            //mConnectionFactory.SetUri(new Uri(uri));
            mConnectionFactory.Uri = uri;
            mConnectionFactory.AutomaticRecoveryEnabled = true;
        }

        public IRabbitMqConnection CreateConnection()
        {
            IConnection connection = mConnectionFactory.CreateConnection();
            //connection.RecoverySucceeded += (object obj, EventArgs e) => {
            //    Log.i("RecoverySucceeded");
            //};
            //connection.ConnectionRecoveryError += (object obj, ConnectionRecoveryErrorEventArgs e) =>
            //{
            //    Log.w("ConnectionRecoveryError");
            //};
            return new RabbitMqConnection(connection);
        }
    }
}
