using HpSchedulerJob.NET.Foundation;
using HpSchedulerJob.NET.HpSchedule.Model;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.HpSchedule
{
    public abstract class HpScheduleJob
    {
        private readonly static string dispatch_center_callback_key = "__dispatcher_center_callback";

        private string rabbitmq_url;

        public abstract void Execute(HpScheduleContext context);

        public void run(string rabbitmq_url, string jobKey, HpScheduleOptions options = null)
        {
            if (options == null)
            {
                options = new HpScheduleOptions();
            }

            this.rabbitmq_url = rabbitmq_url;

            Log.config(options.Log4net);

            try
            {
                var factory = new WorkQueueFactory(rabbitmq_url);

                var consumer = factory.CreateMqConsumer();

                consumer.ReceivedMessage(jobKey, (model, ea) =>
                {
                    var message = Encoding.UTF8.GetString(ea.Body);
                    GetMsg(message, options);
                });
            }
            catch (Exception ex)
            {
                Log.e(ex);
            }
        }

        private void GetMsg(string message, HpScheduleOptions option)
        {
            if (option.IsLog)
            {
                Log.i(message);
            }

            var context = new HpScheduleContext();
            var entity = Newtonsoft.Json.JsonConvert.DeserializeObject<DeliveredModel>(message);
            context.taskid = entity.task_id;
            context.param = entity.param;
            context.routingkey = dispatch_center_callback_key;
            context.rabbimqUrl = rabbitmq_url;

            Execute(context);
        }

    }
}
