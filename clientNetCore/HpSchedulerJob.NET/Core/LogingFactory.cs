using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;
using System.Text;

namespace HpSchedulerJob.NET
{
    public class LogingFactory : ILogingFactory
    {
        ILoggerFactory loggerFactory = new LoggerFactory();

        public LogingFactory(EnumLoging logenum)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            switch (logenum)
            {
                case EnumLoging.Nlog: loggerFactory.AddNLog(); break;
                case EnumLoging.Console: loggerFactory.AddConsole(); break;
                case EnumLoging.LogConsole: loggerFactory.AddConsole().AddNLog(); break;
                default: break;
            }
        }

        public ILogger CreateLogger<T>()
        {
            return loggerFactory.CreateLogger<T>();
        }
    }


    public enum EnumLoging
    {
        Nlog = 1,
        Console = 2,
        LogConsole = 3
    }


}
