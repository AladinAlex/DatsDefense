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
                Console.WriteLine($"Попытка получения статики карты. Ошибка: {ex.Message}");
            }

            // timer
            {
                //todo:
                /*
                 1. Ищем цель для каждой башни. Атаковать - для каждой башни вызывать метод, он находит координаты (цель) - ближайшая цель.
                        1.1 Метод поиска ближайшей цели. Передаем (x, y) текущей нашей башни,
                        1.2 Сортируем цели, сначала будут зомби, зомби сортируем сначала джагернаут, потом линер, потом бомбер, остальные похуй.
                            потом чужие башни (чужие башни/зомби)
                        1.3 находим ближайшую цель, отнимаем у нее хп.
                 2. Посмотрим количество жизней у ГБ, если меньше чем в предыдущий раз - то перемещаем. Метод поиска центровой башни из массива.
                 3. Написать методы вызова api, изменения/генерации реквеста.
                 */
            }


        }
    }
}
