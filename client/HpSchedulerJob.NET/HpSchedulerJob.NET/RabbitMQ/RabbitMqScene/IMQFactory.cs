using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq.RabbitMqScene
{
    public interface IMQFactory
    {
        IMQProducer CreateMqProducer(string routingKey);
        IMQConsumer CreateMqConsumer(string routingKey);

    }
}
