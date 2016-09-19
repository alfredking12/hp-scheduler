using HpSchedulerJob.NET.Foundation;
using HpSchedulerJob.NET.RabbitMq.RabbitMqScene;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.HpSchedule
{
    public class JobApplication
    {
        public JobApplication(HpScheduleOptions options = null)
        {
            if (options == null)
            {
                options = new HpScheduleOptions();
            }

            //初始化日志
            if (options.Nlog)
            {
                //Log.config(options.Log4net);

                Loging.setLogType(EnumLoging.LogConsole);
                //简单格式的Log
                // if (options.Debug) Log.SimpleFormat = true;
            }

            //初始化配置
            if (!string.IsNullOrEmpty(options.Config))
            {
                ConfigurationCenter.addConfigurationImpl(new JsonConfiguration(options.Config));

                if (!ConfigurationCenter.load())
                {
                    throw new Exception("加载配置文件失败");
                }
            }
        }

        public void start(string dispatcher_center_callback, params HpScheduleJob[] jobs)
        {
            if (string.IsNullOrEmpty(dispatcher_center_callback))
            {
                dispatcher_center_callback = "__dispatcher_center_callback";
            }

            foreach (var job in jobs)
            {
                job.run(dispatcher_center_callback);
            }
        }

        public void stop()
        {
            // Log.shutdown();
        }

    }
}
