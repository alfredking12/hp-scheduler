using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq
{
    public class RabbtMqManagerProxy : IRabbtMqManagerProxy
    {

        private IRabbitMqManagerClient rabbitMqManagerClient = null;

        private IConnection publishConnection = null;

        private IConnection consumerConnection = null;

        private IConnection mConnection = null;

        public RabbtMqManagerProxy(RabbitMqConfig config)
        {
            this.rabbitMqManagerClient = new RabbitMqManagerClient(config.VirtualHost, config.UserName, config.Password);
        }

        public RabbtMqManagerProxy(string uri)
        {
            this.rabbitMqManagerClient = new RabbitMqManagerClient(uri);
        }

        public IRabbitMqClient GetCustomerClient()
        {
            this.consumerConnection = this.rabbitMqManagerClient.CreateConsumerConnection();
            return new RabbitMqClient(this.rabbitMqManagerClient.CreateConsumerChannel());
        }

        public IRabbitMqClient GetPublishClient()
        {
            this.publishConnection = rabbitMqManagerClient.CreatePublishConnection();
            return new RabbitMqClient(this.rabbitMqManagerClient.CreatePublishChannel());
        }

        public IRabbitMqClient GetRabbitMqClient()
        {
            this.mConnection = rabbitMqManagerClient.CreateConnection();
            return new RabbitMqClient(this.rabbitMqManagerClient.CreateChannel());
        }

        public void Dispose()
        {
            this.publishConnection?.Dispose();
            this.consumerConnection?.Dispose();
            this.mConnection?.Dispose();
        }
    }
}
