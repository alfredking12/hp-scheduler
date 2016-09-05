using System.Collections.Generic;
namespace HpScheduler.Core.Foundation
{
    public interface IConfiguration
    {
        bool load();
        string getValue(string key);
    }

    public class ConfigurationCenter
    {
        #region Singleton

        private static ConfigurationCenter instance;

        private static object _locker = new object();

        protected ConfigurationCenter() { }

        protected static ConfigurationCenter getInstance()
        {
            if (instance == null)
            {
                lock (_locker)
                {
                    if (instance == null)
                    {
                        instance = new ConfigurationCenter();
                    }
                }
            }
            return instance;
        }

        #endregion

        protected List<IConfiguration> configList = new List<IConfiguration>();

        public static bool addConfigurationImpl(IConfiguration config)
        {
            return ConfigurationCenter.getInstance()._addConfigurationImpl(config);
        }

        public static string getValue(string key, string defaultValue = "")
        {
            return ConfigurationCenter.getInstance()._getValue(key, defaultValue);
        }

        public static bool load()
        {
            return ConfigurationCenter.getInstance()._load();
        }

        protected bool _addConfigurationImpl(IConfiguration config)
        {
            if (configList.Contains(config))
                return false;
            configList.Add(config);
            return true;
        }

        protected string _getValue(string key, string defaultValue)
        {
            string val = defaultValue;

            foreach (IConfiguration config in configList)
            {
                val = config.getValue(key);

                if (val != null)
                    break;
            }

            if (val == null)
            {
                val = defaultValue;
               // Log.w("未能读取配置信息：" + key);
            }

            return val;
        }

        protected bool _load()
        {
            bool ret = false;
            for (int i=this.configList.Count-1;i>=0;i--)
            {
                IConfiguration config = this.configList[i];

                if (config.load())
                { 
                    ret = true;
                }
                else
                {
                    this.configList.RemoveAt(i);
                }
            }
            return ret;
        }
    }
}
