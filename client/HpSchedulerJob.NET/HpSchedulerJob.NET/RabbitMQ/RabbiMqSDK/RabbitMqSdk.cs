using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq
{
    public class RabbitMqSdk
    {

        private static readonly Dictionary<string, IRabbtMqManagerProxy> Map = new Dictionary<string, IRabbtMqManagerProxy>();

        public static void AddClientManager(IRabbtMqManagerProxy clientMgr, string key = "")
        {
            Map.Add(key, clientMgr);
        }

        public static IRabbtMqManagerProxy GetRabbtiMqClient(string key)
        {
            return Map[key];
        }

        public static IRabbtMqManagerProxy GetMqClient(string rabbitmquri)
        {
            return (IRabbtMqManagerProxy)new RabbtMqManagerProxy(rabbitmquri);
        }

    }
}
