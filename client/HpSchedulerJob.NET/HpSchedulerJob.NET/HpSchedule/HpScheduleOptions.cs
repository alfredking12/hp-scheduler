namespace HpSchedulerJob.NET.HpSchedule
{
    public class HpScheduleOptions
    {
        public bool IsLog = true;
        public string Log4net = HpSchedulerJob.NET.Foundation.Utils.AppUtil.GetPath() + "\\..\\log4net.config";
    }
}
