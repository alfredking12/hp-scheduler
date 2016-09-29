using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HpSchedulerJob.NET.Foundation.Utils
{
    public static class DateTimeUtil
    {
        public static Int64 timestamp(DateTime dateTime)
        {
            return (Int64)(dateTime - new DateTime(1970, 1, 1).ToLocalTime()).TotalMilliseconds;
        }

        //TODO: 比较与timestamp的差异
        public static Int64 timestamp_unix(DateTime dateTime)
        {
            return (Int64)(dateTime.ToUniversalTime().Ticks - 621355968000000000) / 10000;
        }

        public static string format(DateTime dateTime, string format)
        {
            return dateTime.ToString(format);
        }

        /// <summary>
        /// 单位ms
        /// </summary>
        /// <param name="unixTimestamp"></param>
        /// <returns></returns>
        public static DateTime fromTimestamp(long timestamp)
        {
            return new DateTime(timestamp * 10000 + 621355968000000000, DateTimeKind.Utc)
                .ToLocalTime();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="time">传入毫秒时间戳，或者System.DateTime</param>
        /// <returns></returns>
        public static DateTime toDateTime(object time)
        {
            DateTime defaultTime = new DateTime(1970, 1, 1).ToLocalTime();

            if (time == null || time == DBNull.Value)
                return defaultTime;

            if (time.GetType().FullName == "System.DateTime")
            {
                return (DateTime)time;
            }

            try
            {
                Int64 timestamp = StringUtil.toInt64(StringUtil.toString(time));
                return fromTimestamp(timestamp); ;
            }
            catch (Exception)
            {
                return defaultTime;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="time">传入毫秒时间戳，或者System.DateTime</param>
        /// <returns></returns>
        public static Int64 timestamp(object time)
        {
            return timestamp(toDateTime(time));
        }
    }
}
