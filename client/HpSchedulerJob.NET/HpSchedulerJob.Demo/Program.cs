using HpSchedulerJob.NET.Foundation;
using HpSchedulerJob.NET.Foundation.Utils;
using HpSchedulerJob.NET.HpSchedule;
using System;

namespace HpSchedulerJob.Demo
{

    public class Demo : HpScheduleJob
    {
        public Demo(string rabbitmq_url, string jobKey) : base(rabbitmq_url, jobKey)
        {
        }

        public override void Execute(HpScheduleContext context)
        {
            context.Log("开始", 0);
            context.Log("第一步完成", 30);
            context.Log("第二步完成", 60);
            context.Log("调试信息输出");
            context.Log("结束", 100);
        }

        protected override string getJobName()
        {
            return "demo_" + this.GetHashCode();
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            JobApplication app = new JobApplication(new HpScheduleOptions()
            {
                Debug = true,
                Log4net = AppUtil.GetPath() + "\\..\\..\\log4net.config",
                Config = AppUtil.GetPath() + "\\..\\..\\config.json"
            });

            var dispatcher_center_callback = ConfigurationCenter.getValue("dispatcher_center_callback");

            app.start(dispatcher_center_callback, 
                new Demo(ConfigurationCenter.getValue("rabbitmq_url"), "demo5"),
                new Demo(ConfigurationCenter.getValue("rabbitmq_url"), "demo5"),
                new Demo(ConfigurationCenter.getValue("rabbitmq_url"), "demo5")
                );

            Console.ReadLine();

            app.stop();
        }
    }
}
