using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq
{
    public interface IRabbtMqManagerProxy : IDisposable
    {
        IRabbitMqClient GetPublishClient();

        IRabbitMqClient GetCustomerClient();

        IRabbitMqClient GetRabbitMqClient();
    }
}
