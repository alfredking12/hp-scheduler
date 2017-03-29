using Microsoft.Extensions.Logging;

namespace HpSchedulerJob.NET
{
    public interface ILogingFactory
    {
        ILogger CreateLogger<T>();
    }
}
