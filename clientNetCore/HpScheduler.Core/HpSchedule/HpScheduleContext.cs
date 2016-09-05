﻿using HpScheduler.Core.Foundation.Utils;
using HpScheduler.Core.HpSchedule.Model;
using HpScheduler.Core.RabbitMQ.RabbitMqScene;
using Newtonsoft.Json;
using System;
using Test.Core;

namespace HpScheduler.Core.HpSchedule
{
    public class HpScheduleContext
    {
        public string param { get; internal set; }

        public string taskid { get; internal set; }

        internal string routingkey { get; set; }

        internal string rabbimqUrl { get; set; }

        public WeakReference<IMQFactory> mFactory { get; set; }

        internal HpScheduleContext(IMQFactory factory)
        {
            this.mFactory = new WeakReference<IMQFactory>(factory);
        }


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
            }

            return sendMsg(message, progress);
        }

        private bool sendMsg(string message, int? progress)
        {
            IMQFactory factory = null;
            if (!mFactory.TryGetTarget(out factory))
            {
                return false;
            }

            Loging.LogInformation<HpScheduleContext>(String.Format("Task({0}) ::: send message = {1}, progress = {2}", this.taskid, message, progress == null ? "null" : progress.ToString()));

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
                Loging.LogError<HpScheduleContext>(ex.ToString());

                return false;
            }
        }

    }
}
