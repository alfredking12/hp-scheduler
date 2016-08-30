using HpSchedulerJob.NET.Foundation.Utils;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace HpSchedulerJob.NET.Foundation
{
    class log_item
    {
        public string time;
        public int level;
        public int thread_id;
        public int pid;
        public string message;
        public object msg;
        public string context_id;
        public string context_name;
        public string action;
        public string exception;
    }

    public static class Log
    {
        internal static readonly bool Enable = true;

        /// <summary>
        /// 上下文ID
        /// </summary>
        [ThreadStatic]
        public static string ContextID = "";

        /// <summary>
        /// 上下文Name
        /// </summary>
        [ThreadStatic]
        public static string ContextName = "";

        public static bool SimpleFormat = false;

        #region 初始化和关闭

        //加载配置文件
        public static void config(string path)
        {
            try
            {
                if (!File.Exists(path))
                {
                    throw new Exception(String.Format("log4net配置文件不存在：{0}", path));
                }

                FileInfo fileInfo = new FileInfo(path);
                log4net.Config.XmlConfigurator.Configure(fileInfo);
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.ToString());
                throw e;
            }
        }

        //加载配置文件
        public static void config(string[] paths)
        {
            foreach (string path in paths)
            {
                try
                {
                    config(path);
                    return;
                }
                catch (Exception e)
                {
                    Log.w("log4net:" + path, e);
                }
            }

            throw new Exception("加载log4net.config文件异常");
        }

        //关闭日志
        public static void shutdown()
        {
            log4net.LogManager.Shutdown();
        }

        #endregion

        #region debug

        public static void d(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            debug(logger, msg, action);
        }

        public static void d(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            debug(logger, msg, action, e);
        }

        public static void d(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            debug(logger, msg, action);
        }

        public static void d(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            debug(logger, msg, action, e);
        }

        public static void debug(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            debug(logger, msg, action);
        }

        public static void debug(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            debug(logger, msg, action, e);
        }

        public static void debug(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            debug(logger, msg, action);
        }

        public static void debug(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            debug(logger, msg, action, e);
        }

        private static void debug(log4net.ILog logger, object msg, string action = "", Exception e = null)
        {
            if (!Log.Enable) return;

            if (!logger.IsDebugEnabled) return;

            msg = format(msg, action, log4net.Core.Level.Debug.Value, e);

            if (e != null) Trace.WriteLine(string.Format("DEBUG: {0}\n{1}", msg, e.ToString()));

            logger.Debug(msg);

        }

        #endregion

        #region info

        public static void i(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            info(logger, msg, action);
        }

        public static void i(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            info(logger, msg, action, e);
        }

        public static void i(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            info(logger, msg, action);
        }

        public static void i(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            info(logger, msg, action, e);
        }

        public static void info(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            info(logger, msg, action);
        }

        public static void info(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            info(logger, msg, action, e);
        }

        public static void info(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            info(logger, msg, action);
        }

        public static void info(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            info(logger, msg, action, e);
        }

        private static void info(log4net.ILog logger, object msg, string action = "", Exception e = null)
        {
            if (!Log.Enable) return;

            if (!logger.IsInfoEnabled) return;

            msg = format(msg, action, log4net.Core.Level.Info.Value, e);

            if (e != null) Trace.WriteLine(string.Format("DEBUG: {0}\n{1}", msg, e.ToString()));

            logger.Info(msg);
        }

        #endregion

        #region warn

        public static void w(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            warn(logger, msg, action);
        }

        public static void w(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            warn(logger, msg, action, e);
        }

        public static void w(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            warn(logger, msg, action);
        }

        public static void w(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            warn(logger, msg, action, e);
        }

        public static void warn(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            warn(logger, msg, action);
        }

        public static void warn(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            warn(logger, msg, action, e);
        }

        public static void warn(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            warn(logger, msg, action);
        }

        public static void warn(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            warn(logger, msg, action, e);
        }

        private static void warn(log4net.ILog logger, object msg, string action = "", Exception e = null)
        {
            if (!Log.Enable) return;

            if (!logger.IsWarnEnabled) return;

            msg = format(msg, action, log4net.Core.Level.Warn.Value, e);

            if (e != null) Trace.WriteLine(string.Format("WARN: {0}\n{1}", msg, e.ToString()));

            logger.Warn(msg);
        }

        #endregion

        #region error

        public static void e(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            error(logger, msg, action);
        }

        public static void e(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            error(logger, msg, action, e);
        }

        public static void e(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            error(logger, msg, action);
        }

        public static void e(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            error(logger, msg, action, e);
        }

        public static void error(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            error(logger, msg, action);
        }

        public static void error(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            error(logger, msg, action, e);
        }

        public static void error(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            error(logger, msg, action);
        }

        public static void error(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            error(logger, msg, action, e);
        }

        private static void error(log4net.ILog logger, object msg, string action = "", Exception e = null)
        {
            if (!Log.Enable) return;

            if (!logger.IsErrorEnabled) return;

            msg = format(msg, action, log4net.Core.Level.Error.Value, e);

            if (e != null) Trace.WriteLine(string.Format("ERROR: {0}\n{1}", msg, e.ToString()));

            logger.Error(msg);
        }

        #endregion

        #region fatal

        public static void f(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            fatal(logger, msg, action);
        }

        public static void f(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            fatal(logger, msg, action, e);
        }

        public static void f(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            fatal(logger, msg, action);
        }

        public static void f(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            fatal(logger, msg, action, e);
        }

        public static void fatal(object msg, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            fatal(logger, msg, action);
        }

        public static void fatal(object msg, Exception e, string action = "", string name = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(name);
            fatal(logger, msg, action, e);
        }

        public static void fatal(object msg, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            fatal(logger, msg, action);
        }

        public static void fatal(object msg, Exception e, Type type, string action = "")
        {
            log4net.ILog logger = log4net.LogManager.GetLogger(type);
            fatal(logger, msg, action, e);
        }

        private static void fatal(log4net.ILog logger, object msg, string action = "", Exception e = null)
        {
            if (!Log.Enable) return;

            if (!logger.IsFatalEnabled) return;

            msg = format(msg, action, log4net.Core.Level.Fatal.Value, e);

            if (e != null) Trace.WriteLine(string.Format("FATAL: {0}\n{1}", msg, e.ToString()));

            logger.Fatal(msg);
        }

        #endregion

        public static void exception(Exception e, string action = "")
        {
            Log.i("服务器出现异常", e, action);
        }

        private static string format(object msg, string action, int level, Exception e)
        {
            if (SimpleFormat)
            {
                if (!(msg is string))
                {
                    msg = JsonUtil.SerializeObject(msg);
                }

                if (e != null)
                {
                    msg = msg + ", exception: " + e.ToString();
                }

                return string.Format("{0} - {1}", DateTimeUtil.format(DateTime.Now, "yyyy-MM-dd HH:mm:ss.fff"), msg.ToString());
            }

            string ex_msg = null;
            if (e != null)
            {
                ex_msg = e.Message + " --- " + e.StackTrace;
                ex_msg = ex_msg.Replace("\r\n", " - ");
            }

            var item = new log_item {
                action = String.IsNullOrEmpty(action) ? null : action,
                context_id = String.IsNullOrEmpty(Log.ContextID) ? null : Log.ContextID,
                context_name = String.IsNullOrEmpty(Log.ContextName) ? null : Log.ContextName,
                pid = Process.GetCurrentProcess().Id,
                thread_id = Thread.CurrentThread.ManagedThreadId,
                time = DateTimeUtil.format(DateTime.Now, "yyyy-MM-dd HH:mm:ss.fff"),
                level = level,
                exception = ex_msg
            };

            if (msg is string)
            {
                item.message = msg.ToString();
            }
            else
            {
                item.msg = msg;
            }

            return JsonUtil.SerializeObject(item);
        }
    }
}
