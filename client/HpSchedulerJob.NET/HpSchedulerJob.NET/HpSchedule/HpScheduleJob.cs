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

            if (options.Debug)
            {
                //简单格式的Log
                Log.SimpleFormat = true;
            }

            Log.i("启动服务");

            try
            {
                var factory = SchedulerMq.getInstance(rabbitmq_url).getFactory();

                var consumer = factory.CreateMqConsumer();

                Log.i("建立连接: " + rabbitmq_url);

                consumer.ReceivedMessage(jobKey, (model, ea) =>
                {
                    var message = Encoding.UTF8.GetString(ea.Body);
                    GetMsg(message, options);
                });

                Log.i("监听MQ消息: " + jobKey);
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
            Log.ContextName = this.GetType().ToString();
            Log.ContextID = Guid.NewGuid().ToString("D");
            Execute(context);
            Log.ContextName = null;
        }

    }
}
