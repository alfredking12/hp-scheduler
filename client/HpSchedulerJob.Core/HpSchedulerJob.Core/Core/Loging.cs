using Microsoft.Extensions.Logging;

namespace HpSchedulerJob.NET
{
    public class Loging
    {

        private static object _lock = new object();
        private static ILogger logger = null;

        private static EnumLoging logType;

        public static void setLogType(EnumLoging logenum)
        {
            logType = logenum;
        }

        private static ILogger getInstance<T>(EnumLoging logenum)
        {
            if (logger == null)
            {
                lock (_lock)
                {
                    if (logger == null)
                    {
                        ILogingFactory factory = new LogingFactory(logenum);
                        logger = factory.CreateLogger<T>();
                    }
                }
            }
            return logger;
        }

        public static void LogError<T>(string message, params object[] args)
        {
            Loging.getInstance<T>(logType).LogError(message, args);
        }

        public static void LogError(string message, params object[] args)
        {
            Loging.getInstance<object>(logType).LogError(message, args);
        }

        public static void LogInformation<T>(string message, params object[] args)
        {
            Loging.getInstance<T>(logType).LogInformation(message, args);
        }

        public static void LogInformation(string message, params object[] args)
        {
            Loging.getInstance<object>(logType).LogInformation(message, args);
        }

        public static void LogWarning<T>(string message, params object[] args)
        {
            Loging.getInstance<T>(logType).LogWarning(message, args);
        }

        public static void LogWarning(string message, params object[] args)
        {
            Loging.getInstance<object>(logType).LogWarning(message, args);
        }
    }
}
