using System.Collections.Generic;

namespace HpScheduler.Core.RabbitMQ.RabbiMqSDK
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
