using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq
{
    public interface IRabbitMqManagerClient
    {
        IConnection CreatePublishConnection();

        IModel CreatePublishChannel();

        IConnection CreateConsumerConnection();

        IModel CreateConsumerChannel();

        IConnection CreateConnection();

        IModel CreateChannel();

    }





}
