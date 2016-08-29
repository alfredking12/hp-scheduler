using System;
using System.Collections.Specialized;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Cache;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Hopin.Foundation.Utils
{
    public enum HttpMethods
    {
        Get,
        Post,
        Put,
        Delete
    }

    public class HttpOptions
    {
        public string ContentType = HttpUtil.JsonType;
        public HttpMethods Method = HttpMethods.Get;
        //超时时间 (秒)
        public int Timeout = 30;
        public bool AllowAutoRedirect = true;
        public string Accept = HttpUtil.JsonType;
        public string UA = "Hopin API Server";
        public RequestCachePolicy CachePolicy = new RequestCachePolicy(RequestCacheLevel.NoCacheNoStore);
        public Action<HttpWebRequest> RequestHandler = null;
        public Encoding Encoding = Encoding.UTF8;
        public Encoding OutputEncoding = null;
        public NameValueCollection Headers;
        public bool Log = true;
        public bool throwException = false;
    }

    public static class HttpUtil
    {
        public static readonly string JsonType = "application/json";
        public static readonly string HtmlType = "text/html, application/xhtml+xml, */*,zh-CN";
        public static readonly string TextType = "text/plain";

        //meta正则表达式
        internal static Regex MetaRegex = new Regex("<meta([^<]*)charset=([^<]*)[\"']", RegexOptions.IgnoreCase | RegexOptions.Multiline);
        #region Http Requests

        public static string get(string url, HttpOptions options = null)
        {
            if (options == null) options = new HttpOptions();
            options.Method = HttpMethods.Get;
            return request(url, null, options);
        }

        public static string delete(string url, HttpOptions options = null)
        {
            if (options == null) options = new HttpOptions();
            options.Method = HttpMethods.Delete;
            return request(url, null, options);
        }

        public static string post(string url, string data, HttpOptions options = null)
        {
            if (options == null) options = new HttpOptions();
            options.Method = HttpMethods.Post;
            return request(url, data, options);
        }

        public static string put(string url, string data, HttpOptions options = null)
        {
            if (options == null) options = new HttpOptions();
            options.Method = HttpMethods.Put;
            return request(url, data, options);
        }

        public static string request(string url, string data, HttpOptions options)
        {
            //调用外部接口开始日志
            if (options.Log)
            {
                Log.i("HttpUtil beginRequest url=" + url + ", data=" + data);
            }

            string result = "";

            if (!url.Contains("http://") && !url.Contains("https://"))
                url = "http://" + url;

            if (options == null) options = new HttpOptions();

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = options.Method.ToString().ToLower();
            request.Timeout = options.Timeout * 1000;
            request.AllowAutoRedirect = options.AllowAutoRedirect;
            request.ContentType = options.ContentType;
            request.Accept = options.Accept;
            request.UserAgent = options.UA;
            request.CachePolicy = options.CachePolicy;
            if (options.Headers != null)
                request.Headers.Add(options.Headers);

            if (options.RequestHandler != null)  options.RequestHandler(request);

            var encoding = options.Encoding ?? Encoding.UTF8;

            try
            {
                //设置body数据
                if (options.Method == HttpMethods.Post || options.Method == HttpMethods.Put)
                {
                    byte[] buffer = encoding.GetBytes(data);
                    request.ContentLength = buffer.Length;
                    request.GetRequestStream().Write(buffer, 0, buffer.Length);
                }

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    if (options.OutputEncoding == null)
                    {
                        result = getEncodingResponse(response);
                    }
                    else
                    {
                        using (StreamReader reader = decompressGZipIfNeed(response, encoding))
                        {
                            result = reader.ReadToEnd();
                        }
                    }
                }

                if (options.Log)
                {
                    //调用外部接口结束日志
                    Log.i("HttpUtil response=" + result);
                }
            }
            catch (Exception e)
            {
                if (options.Log)
                {
                    //调用外部接口异常日志
                    Log.e("HttpUtil response exception.", e);
                }

                if (options.throwException)
                    throw;
            }

            return result;
        }

        private static StreamReader decompressGZipIfNeed(HttpWebResponse response, Encoding encoding)
        {
            if (response.ContentEncoding != null && response.ContentEncoding.Equals("gzip", StringComparison.InvariantCultureIgnoreCase))
            {
                return new StreamReader(new GZipStream(response.GetResponseStream(), CompressionMode.Decompress), encoding);
            }
            else
            {
                return new StreamReader(response.GetResponseStream(), encoding);
            }
        }
        private static string getEncodingResponse(HttpWebResponse response)
        {
            Encoding encoding = null;
            byte[] raw = null;
            do
            {
                MemoryStream stream = new MemoryStream();
                if (response.ContentEncoding != null && response.ContentEncoding.Equals("gzip", StringComparison.InvariantCultureIgnoreCase))
                    new GZipStream(response.GetResponseStream(), CompressionMode.Decompress).CopyTo(stream, 10240);
                else
                    response.GetResponseStream().CopyTo(stream, 10240);

                raw = stream.ToArray();
                string temp = Encoding.Default.GetString(raw, 0, raw.Length);
                Match meta = MetaRegex.Match(temp);
                string charter = (meta.Groups.Count > 2) ? meta.Groups[2].Value : string.Empty;
                charter = charter.Replace("\"", string.Empty).Replace("'", string.Empty).Replace(";", string.Empty);
                if (charter.Length > 0)
                {
                    charter = charter.ToLower().Replace("iso-8859-1", "gbk");
                    encoding = Encoding.GetEncoding(charter);
                    break;
                }

                if (response.CharacterSet.ToLower().Trim() == "iso-8859-1")
                {
                    encoding = Encoding.GetEncoding("gbk");
                    break;
                }

                if (string.IsNullOrEmpty(response.CharacterSet.Trim()))
                {
                    encoding = Encoding.UTF8;
                    break;
                }

                encoding = Encoding.GetEncoding(response.CharacterSet);

            } while (false);

            return encoding.GetString(raw);
        }

        #endregion

        #region Remote Address

        public static string getRemoteAddress(HttpContext context)
        {
            if (context == null || context.Request == null)
                return "";

            string result = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            do
            {
                //没有代理
                if (result == null || result == String.Empty)
                    break;

                //没有“.”肯定是非IPv4格式
                if (result.IndexOf(".") == -1)
                {
                    result = null;
                    break;
                }

                //有“,”，估计多个代理。取第一个不是内网的IP。
                if (result.IndexOf(",") != -1)
                {
                    result = result.Replace(" ", "").Replace("'", "");
                    string[] temparyip = result.Split(",;".ToCharArray());
                    for (int i = 0; i < temparyip.Length; i++)
                    {
                        //只取非内网IP
                        if (isRemoteIP(temparyip[i]))
                        {
                            result = temparyip[i];
                            break;
                        }
                    }
                }
                else
                {
                    //代理IP非内网
                    if (!isRemoteIP(result))
                        result = null;
                }
            } while (false);

            if (result == null || result == String.Empty)
                result = context.Request.ServerVariables["REMOTE_ADDR"];

            if (result == null || result == String.Empty)
                result = context.Request.UserHostAddress;

            return result;
        }

        public static bool isRemoteIP(String ipAddress)
        {
            return isIPAddress(ipAddress) && ipAddress.Substring(0, 3) != "10." && ipAddress.Substring(0, 7) != "192.168" && ipAddress.Substring(0, 7) != "172.16.";
        }

        public static bool isIPAddress(string IpAddress)
        {
            if (IpAddress == null || IpAddress == string.Empty || IpAddress.Length < 7 || IpAddress.Length > 15)
            {
                return false;
            }

            string regformat = @"^\d{1,3}[\.]\d{1,3}[\.]\d{1,3}[\.]\d{1,3}$";
            Regex regex = new Regex(regformat, RegexOptions.IgnoreCase);

            return regex.IsMatch(IpAddress);
        }

        #endregion
    }
}
