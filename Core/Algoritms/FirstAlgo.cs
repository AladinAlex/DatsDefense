using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Algoritms
{
    public class FirstAlgo
    {
        private HttpCore core;
        public FirstAlgo()
        {
            core = new HttpCore();
        }

        public async Task MainASync()
        {
            Console.WriteLine("Запущен алгоритм 1");
            // 1. Start Round
            try
            {
                var rStartRound = await core.StartRound();
                Console.WriteLine($"Успешная регистрация на раунд. До начала: {rStartRound.StartsInSec} секунд.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Провал при регистрации на раунд. Ошибка: {ex.Message}");
            }


            try
            {
                var rStatic = await core.StaticMap();
                Console.WriteLine($"Получение статики карты");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Попытка . Ошибка: {ex.Message}");
            }


        }
    }
}
