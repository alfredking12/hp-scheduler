using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Test.Core;
using System.Text;
using NLog.Extensions.Logging;

namespace Test.Core
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
        Console = 2
    }


}
