namespace HpScheduler.Core.HpSchedule
{
    public class HpScheduleOptions
    {
        public bool Debug = false;
        public string Log4net = HpScheduler.Core.Foundation.Utils.AppUtil.GetPath() + "\\..\\log4net.config";
        public string Config = HpScheduler.Core.Foundation.Utils.AppUtil.GetPath() + "\\..\\config.json";
    }
}
