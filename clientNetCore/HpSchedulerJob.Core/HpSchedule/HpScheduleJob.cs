using HpSchedulerJob.NET.HpSchedule.Model;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue;
using Newtonsoft.Json;
using System;

namespace HpSchedulerJob.NET.HpSchedule
{
    public abstract class HpScheduleJob
    {
        private IMQFactory mFactory;
        private string rabbitmq_url;
        private string jobKey;
        private string dispatcher_center_callback;

        public HpScheduleJob(string rabbitmq_url, string jobKey)
        {
            this.rabbitmq_url = rabbitmq_url;
            this.jobKey = jobKey;
            //创建MQ工厂
            this.mFactory = new WorkQueueFactory(rabbitmq_url);
        }

        public abstract void Execute(HpScheduleContext context);

        protected virtual string getJobName()
        {
            return this.GetType().ToString();
        }

        internal void run(string dispatcher_center_callback)
        {
            this.dispatcher_center_callback = dispatcher_center_callback;

            Loging.LogInformation<HpScheduleJob>("启动服务:" + this.getJobName());
            this.listen(this.rabbitmq_url, this.jobKey);
        }

        private void listen(string rabbitmq_url, string jobKey)
        {
            try
            {
                Loging.LogInformation<HpScheduleJob>("建立连接: " + rabbitmq_url + ", jobKey: " + jobKey);

                var consumer = mFactory.CreateMqConsumer(jobKey);

                Loging.LogInformation<HpScheduleJob>("监听MQ消息: " + jobKey);

                consumer.ReceivedMessage((deliveryTag, message) =>
                {
                    //Log.ContextName = this.GetType().ToString();
                    //Log.ContextID = Guid.NewGuid().ToString("D");
                    Loging.LogInformation<HpScheduleJob>(string.Format("收到消息[{0}-{1}]: {2}", this.getJobName(), jobKey, message));
                    HandleMsg(consumer, message, deliveryTag);
                    // Log.ContextName = null;
                });

                Loging.LogInformation<HpScheduleJob>("服务启动成功:" + this.getJobName());
            }
            catch (Exception ex)
            {
                Loging.LogError<HpScheduleJob>(ex.ToString());
            }
        }

        private void HandleMsg(IMQConsumer consumer, string message, ulong deliveryTag)
        {
            var context = new HpScheduleContext(mFactory);

            try
            {
                var entity = JsonConvert.DeserializeObject<DeliveredModel>(message);

                context.taskid = entity.task_id;
                context.param = entity.param;
                context.routingkey = this.dispatcher_center_callback;
                context.rabbimqUrl = this.rabbitmq_url;

                if (!context.Log("开始执行任务", 0))
                {
                    //应答，并使该消息重新从队列获取
                    consumer.NAck(deliveryTag);
                    return;
                }

                //应答
                consumer.Ack(deliveryTag);

                try
                {
                    //执行任务
                    Execute(context);
                }
                catch (Exception e)
                {
                    Loging.LogError<HpScheduleJob>("执行任务失败", e);
                    context.Log(e.ToString(), -1);
                }
            }
            catch (System.Exception e)
            {
                Loging.LogInformation<HpScheduleJob>(e.ToString());
                context.Log(e.ToString(), -1);
            }
        }
    }
}
