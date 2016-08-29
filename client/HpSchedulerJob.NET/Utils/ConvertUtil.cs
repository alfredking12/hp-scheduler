using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hopin.Foundation.Utils
{
    public static class ConvertUtil
    {
        public static List<T> toList<T>(IEnumerable<T> o)
        {
            List<T> result = new List<T>();

            foreach (var a in o)
            {
                result.Add(a);
            }

            return result;
        }

        public static decimal toFixed(decimal value, int len)
        {
            int p = (int)Math.Pow(10, len);
            return (decimal)((int)(value * p)) / p;
        }
    }
}
