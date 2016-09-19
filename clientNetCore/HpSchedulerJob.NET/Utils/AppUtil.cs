using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.Foundation.Utils
{
    public static class AppUtil
    {
        public static string GetPath()
        {
            return Path.GetDirectoryName(new Uri(System.Reflection.Assembly.GetEntryAssembly().CodeBase).LocalPath);
        }

        public static string GetLocalPath(string path)
        {
            return Path.GetFullPath(path);
        }

    }
}
