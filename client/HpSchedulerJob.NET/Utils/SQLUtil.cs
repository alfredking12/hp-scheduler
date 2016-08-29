using System;

namespace Hopin.Foundation.Utils
{
    public static class SQLUtil
    {
        /// <summary>
        /// 替换SQL特殊字符
        /// </summary>
        /// <param name="str">过滤字段</param>
        /// <returns></returns>
        public static string ReplaceSQLChar(string str)
        {
            if (str == String.Empty) return String.Empty;
            str = str.Replace("'", "‘");
            str = str.Replace(";", "；");
            str = str.Replace(",", ",");
            str = str.Replace("?", "?");
            str = str.Replace("<", "＜");
            str = str.Replace(">", "＞");
            str = str.Replace("(", "(");
            str = str.Replace(")", ")");
            str = str.Replace("@", "＠");
            str = str.Replace("=", "＝");
            str = str.Replace("+", "＋");
            str = str.Replace("*", "＊");
            str = str.Replace("&", "＆");
            str = str.Replace("#", "＃");
            str = str.Replace("%", "％");
            str = str.Replace("$", "￥");
            return str;
        }
    }
}
