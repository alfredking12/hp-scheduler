using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Test.Core
{
    public interface ILogingFactory
    {
        ILogger CreateLogger<T>();
    }
}
