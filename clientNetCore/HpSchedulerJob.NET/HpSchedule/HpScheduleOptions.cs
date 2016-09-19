namespace HpSchedulerJob.NET.HpSchedule
{
    public class HpScheduleOptions
    {
        public bool Debug = false;

        //public string Log4net = HpSchedulerJob.NET.Foundation.Utils.AppUtil.GetPath() + "\\..\\log4net.config";

        public bool Nlog = false;

        public string Config = HpSchedulerJob.NET.Foundation.Utils.AppUtil.GetPath() + "\\..\\config.json";
    }
}
