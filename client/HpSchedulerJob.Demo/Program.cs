using HpSchedulerJob.NET.HpSchedule;

namespace HpSchedulerJob.Demo
{

    public class Demo : HpScheduleJob
    {
        public override void Execute(HpScheduleContext context)
        {
            context.Log("开始", 0);
            context.Log("第一步完成", 30);
            context.Log("第二步完成", 60);
            context.Log("调试信息输出");
            context.Log("结束", 100);
        }
    }

    class Program
    {
        static void Main(string[] args)
        {

            new Demo().run("amqp://mquser:Bysun@120.26.242.51:5672", "dev_demo");
        }
    }
}
