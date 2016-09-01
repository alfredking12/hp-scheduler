using HpSchedulerJob.NET.Foundation.Utils;
using HpSchedulerJob.NET.HpSchedule.Model;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene.WorkQueue;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.HpSchedule
{
    public delegate void SubJob(HpScheduleSubContext context);


    public class HpScheduleContext
    {
        public string param { get; internal set; }

        public string taskid { get; internal set; }

        internal string routingkey { get; set; }

        internal string rabbimqUrl { get; set; }

        private WeakReference<IMQFactory> mFactory { get; set; }

        public int? progress { get; internal set; }

        public bool Log(string message, int? progress = null)
        {
            if (progress != null)
            {
                if (progress < 0)
                {
                    progress = -1;
                }

                if (progress > 100)
                {
                    progress = 100;
                }

                if (this.progress != null && this.progress > progress && progress > 0)
                {
                    throw new Exception("progress less than before.");
                }

                this.progress = progress;
            }

            return sendMsg(message, progress);
        }

        public void createSubJob(int stage, SubJob job)
        {
            if (stage <= this.progress)
            {
                throw new System.Exception("stage small than progress");
            }

            if (stage > 100) stage = 100;

            job(new HpScheduleSubContext(this, stage));
        }

        internal HpScheduleContext(IMQFactory factory)
        {
            this.mFactory = new WeakReference<IMQFactory>(factory);
        }

        private bool sendMsg(string message, int? progress)
        {
            IMQFactory factory = null;
            if (!mFactory.TryGetTarget(out factory))
            {
                return false;
            }

            HpSchedulerJob.NET.Foundation.Log.i(String.Format("Task({0}) ::: send message = {1}, progress = {2}", this.taskid, message, progress == null ? "null" : progress.ToString()));

            try
            {
                CallBackModel callback = new CallBackModel()
                {
                    task_id = this.taskid,
                    message = message,
                    progress = progress,
                    time = DateTimeUtil.timestamp(DateTime.Now)// DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff")
                };

                var jsonstr = JsonConvert.SerializeObject(callback);

                using (var producer = factory.CreateMqProducer(routingkey))
                {
                    producer.sendMessage(jsonstr);
                }

                return true;
            }
            catch (Exception ex)
            {
                HpSchedulerJob.NET.Foundation.Log.e(ex);
                return false;
            }
        }

    }
}
