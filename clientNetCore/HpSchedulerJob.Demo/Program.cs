using HpSchedulerJob.NET.Foundation;
using HpSchedulerJob.NET.Foundation.Utils;
using HpSchedulerJob.NET.HpSchedule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

            int i = 0;

            //context.createSubJob(20, (ctx) =>
            //{
            //    i++;
            //    ctx.Log("SUB-1", 30);
            //    ctx.Log("SUB-2", 60);
            //    ctx.createSubJob(80, (ctx2) => {

            //        i++;
            //        ctx2.Log("SUB-2-1", 20);

            //        ctx2.createSubJob(30, (ctx3) =>
            //        {
            //            ctx3.Log("SUB-3-1", 40);
            //            ctx3.Log("SUB-3-2", 75);
            //            ctx3.Log("SUB-3-3", 100);
            //        });

            //        ctx2.Log("SUB-2-2", 40);
            //        ctx2.Log("SUB-2-3", 75);
            //        ctx2.Log("SUB-2-4", 100);
            //    });
            //    ctx.Log("SUB-3", 100);
            //});

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
                new Demo(ConfigurationCenter.getValue("rabbitmq_url"), "dev_demo_wfpb")
                );

            Console.ReadLine();

            app.stop();
        }
    }
}
