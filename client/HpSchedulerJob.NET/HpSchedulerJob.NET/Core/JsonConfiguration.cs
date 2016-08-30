using HpSchedulerJob.NET.Foundation.Utils;
using System;
using System.Collections.Generic;
using System.IO;

namespace HpSchedulerJob.NET.Foundation
{
    public class JsonConfiguration : IConfiguration
    {
        private string[] paths;
        private Dictionary<string, string> dict;

        public JsonConfiguration(string path) : this(new string[]{path})
        {
        }

        public JsonConfiguration(string[] paths)
        {
            this.paths = paths;
        }

        private bool exists()
        {
            for (int i = 0; i < this.paths.Length; i++)
            {
                string path = this.paths[i];

                if (File.Exists(path))
                {
                    return true;
                }
            }
            return false;
        }

        public Dictionary<string, string> readJson()
        {
            for (int i = 0; i < this.paths.Length; i++)
            {
                string path = this.paths[i];

                Dictionary<string, string> ret = this.readJson(path);
                if (ret != null)
                    return ret;
            }
            return null;
        }

        private Dictionary<string, string> readJson(string path)
        {
            try
            {
                if (!File.Exists(path))
                {
                    return null;
                }

                string text = File.ReadAllText(path);
                if (string.IsNullOrEmpty(text))
                {
                    return null;
                }

                return JsonUtil.DeserializeJsonToObject<Dictionary<string, string>>(text);

            }
            catch (Exception e)
            {
                Log.e("从本地读配置信息出错:" + path, e);
                return null;
            }
        }

        public static bool writeJson(Dictionary<string, string> json, string path)
        {
            try
            {
                var text = JsonUtil.SerializeObject(json);
                if (string.IsNullOrEmpty(text))
                {
                    return false;
                }

                File.WriteAllText(path, text);

                return true;
            }
            catch (Exception e)
            {
                Log.e("写配置信息到本地出错:" + path, e);
                return false;
            }
        }

        public bool load()
        {
            try
            {
                if (!exists())
                {
                    if (this.dict == null)
                    {
                        Log.e("加载配置失败，文件不存在:\n" + string.Join("\n", this.paths));
                    }
                    else
                    {
                        Log.w("加载配置失败，文件不存在:\n" + string.Join("\n", this.paths));
                    }
                    return false;
                }

                Dictionary<string, string> json = readJson();
                if (json == null)
                {
                    if (this.dict == null)
                    {
                        Log.e("加载配置失败，文件格式不正确"); 
                    }
                    else
                    {
                        Log.w("加载配置失败，文件格式不正确");
                    }
                    return false;
                }

                this.dict = new Dictionary<string, string>();
                foreach (string key in json.Keys)
                {
                    this.dict[key.ToLower()] = json[key];
                }
            }
            catch (Exception e)
            {
                if (this.dict == null)
                {
                    Log.e("加载配置失败", e);
                }
                else
                {
                    Log.w("加载配置失败", e);
                }
                return false;
            }
            return true;
        }

        public string getValue(string key)
        {
            if (this.dict == null || string.IsNullOrEmpty(key))
                return null;

            key = key.ToLower();

            if (this.dict.ContainsKey(key))
                return this.dict[key];

            return null;
        }
        
    }
}
