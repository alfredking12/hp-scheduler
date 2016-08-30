using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.RabbitMq
{
    public class RabbitMqSdk
    {
        private static readonly Dictionary<string, IRabbitMqFactory> Map = new Dictionary<string, IRabbitMqFactory>();

        public static void AddClientManager(IRabbitMqFactory clientMgr, string key = "")
        {
            Map.Add(key, clientMgr);
        }

        public static IRabbitMqFactory GetRabbtiMqClient(string key = "")
        {
            return Map[key];
        }

    }
}
