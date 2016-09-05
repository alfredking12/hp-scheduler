using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;

namespace HpScheduler.Core.Foundation.Utils
{
    public static class StringUtil
    {
        public static string join(string[] array, string sep = ",")
        {
            StringBuilder builder = new StringBuilder();
            foreach (var str in array)
            {
                if (builder.Length != 0)
                {
                    builder.Append(sep);
                }

                builder.Append(str);
            }

            return builder.ToString();
        }

        public static string toString(string str, string defaultValue = "")
        {
            if (String.IsNullOrEmpty(str))
            {
                str = defaultValue;
            }
            return str;
        }

        public static string toString(object obj, string defaultValue = "")
        {
            if (obj == null || obj == DBNull.Value)
            {
                return defaultValue;
            }
            return obj.ToString();
        }

        public static int toInt(string str, int defaultValue = 0)
        {
            int ret = defaultValue;

            if (!String.IsNullOrEmpty(str) && !int.TryParse(str, out ret))
            {
                ret = defaultValue;
            }

            return ret;
        }

        public static int toInt(object obj, int defaultValue = 0)
        {
            if (obj == null || obj == DBNull.Value)
            {
                return defaultValue;
            }
            return toInt(obj.ToString());
        }

        public static Int64 toInt64(string str, Int64 defaultValue = 0)
        {
            Int64 ret = defaultValue;

            if (!String.IsNullOrEmpty(str) && !Int64.TryParse(str, out ret))
            {
                ret = defaultValue;
            }

            return ret;
        }

        public static decimal toDecimal(string str, decimal defaultValue = 0)
        {
            decimal ret = defaultValue;

            if (!String.IsNullOrEmpty(str) && !decimal.TryParse(str, out ret))
            {
                ret = defaultValue;
            }

            return ret;
        }

        public static string fromStream(System.IO.Stream stream)
        {
            StringBuilder builder = new StringBuilder("");
            try
            {
                System.IO.Stream s = stream;
                int count = 0;
                byte[] buffer = new byte[1024];
                while ((count = s.Read(buffer, 0, 1024)) > 0)
                {
                    builder.Append(Encoding.UTF8.GetString(buffer, 0, count));
                }
                s.Flush();
              //  s.Close();
                s.Dispose();
            }
            catch (Exception e)
            {
             //   Log.exception(e);
                return null;
            }
            return builder.ToString();
        }

        public static string replaceWhiteSpace(string str, string replaceString)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                return Regex.Replace(str.Trim(), "\\s+", replaceString);
            }
            return str;
        }

        public static SortedDictionary<string, object> fromXML(string xml)
        {
            SortedDictionary<string, object> result = null;

            try
            {
                if (string.IsNullOrEmpty(xml))
                {
                    return null;
                }

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xml);
                XmlNode xmlNode = xmlDoc.FirstChild;//获取到根节点<xml>
                XmlNodeList nodes = xmlNode.ChildNodes;

                result = new SortedDictionary<string, object>();
                foreach (XmlNode xn in nodes)
                {
                    XmlElement xe = (XmlElement)xn;
                    result[xe.Name] = xe.InnerText;//获取xml的键值对到WxPayData内部的数据中
                }
            }
            catch (Exception e)
            {
                result = null;
              //  Log.exception(e);
            }

            return result;
        }

        /// <summary>
        /// 依据分隔字符获取Int型数组
        /// </summary>
        /// <param name="para"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static int[] GetIntsPara(string para,char obj)
        {
            var reslut = new List<int>();
            if (!string.IsNullOrEmpty(para))
            {
                var strData = para.Split(new char[] { obj }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var str in strData)
                {
                    var intObj = 0;
                    int.TryParse(str, out intObj);
                    reslut.Add(intObj);
                }
            }
            return reslut.ToArray();
        }

        /// <summary>
        /// 依据分隔字符获取string型数组
        /// </summary>
        /// <param name="para"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string[] GetStringPara(string para, char obj)
        {
            var result = new string[] { };
            if (!string.IsNullOrEmpty(para))
            {
                result = para.Split(new char[] { obj }, StringSplitOptions.RemoveEmptyEntries);
            }
            return result;
        }
    }
}
