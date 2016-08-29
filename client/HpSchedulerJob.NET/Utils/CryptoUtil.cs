using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Hopin.Foundation.Utils
{
    public static class CryptoUtil
    {
        private static char[] constant =
         {
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
          };

        public static string MD5(string input)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] hashByte = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sb = new StringBuilder();
            foreach (byte item in hashByte)
                sb.Append(item.ToString("x").PadLeft(2, '0'));
            return sb.ToString();
        }

        private static object _locker = new object();
        private static int seed = DateTime.Now.Millisecond;

        public static string GenerateRandom(int Length)
        {
            lock(_locker)
            {
                seed ++;
                System.Text.StringBuilder newRandom = new System.Text.StringBuilder(52);
                Random rd = new Random(seed);
                for (int i = 0; i < Length; i++)
                {
                    newRandom.Append(constant[rd.Next(52)]);
                }
                return newRandom.ToString();
            }
        }
    }
}
