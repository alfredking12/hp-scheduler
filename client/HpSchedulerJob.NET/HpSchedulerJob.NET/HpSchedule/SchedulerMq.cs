using HpSchedulerJob.NET.RabbitMq;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.HpSchedule
{
    internal class SchedulerMq
    {
        private static object _locker = new object();

        private static SchedulerMq _instance = null;

        private SchedulerMq()
        {
        }

        private void init(string uri)
        {
            RabbitMqSdk.AddClientManager(new WorkQueueFactory(uri));
        }

        public IMQFactory getFactory()
        {
            return (IMQFactory)RabbitMqSdk.GetRabbtiMqClient();
        }

        public static SchedulerMq getInstance(string uri)
        {
            if (_instance == null)
            {
                lock(_locker)
                {
                    if (_instance == null)
                    {
                        _instance = new SchedulerMq();
                        _instance.init(uri);
                    }
                }
            }
            return _instance;
        }
    }
}
