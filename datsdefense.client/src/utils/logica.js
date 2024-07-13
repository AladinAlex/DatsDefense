const typePriority = {
    "juggernaut": 1,
    "liner": 2,
    "bomber": 3,
    "fast": 4,
    "chaos_knight": 5,
    "normal": 6
  };

  // Поиск ближайшей цели для нашей башни ( base )
export const FindTarget = (base, zombies, enemyBlocks, isZombieFirst) => {
    
    let result = {
        x: -1,
        y: -1,
        id: base.id,
        zombies: zombies,
        enemyBlocks: enemyBlocks
    }
    if(isZombieFirst || isZombieFirst === undefined || isZombieFirst === true) {
        if(Array.isArray(zombies) && zombies.length > 0)
        {
            // 1. Сортируем массив зомби по важности
            zombies = zombies.sort((a, b) => {
                const priorityA = typePriority[a.type] || 6;
                const priorityB = typePriority[b.type] || 6;
                return priorityA - priorityB;
            });
            // 2. Ищем ближайшего зомбака
            let zombR = FindBestCoordsByZombie(base, zombies)
            // 3. Если нашли, возвращаем результат
            if(zombR.x !== -1 && zombR.y !== -1) {
                result.x = zombR.x
                result.y = zombR.y
                zombies = zombR.zombies
                
                result.zombies = zombies
                return result;
            }
        }
        else if (Array.isArray(enemyBlocks) && enemyBlocks.length > 0) {
            // 1. Сортируем массив башен противника по возрастанию жизней
            enemyBlocks = enemyBlocks.sort((a, b) => {
                if (a.isHead === b.isHead) {
                return a.health - b.health;
                }
                return a.isHead ? -1 : 1;
            });
            // 2. Ищем ближайшую башню
            let rBlock = FindBestCoordsByBlock(base, enemyBlocks);
            // 3. Если нашли, возвращаем результат
            if(rBlock.x !== -1 && rBlock.y !== -1) {
                result.x = rBlock.x
                result.y = rBlock.y
                enemyBlocks = rBlock.enemyBlocks
                
                result.enemyBlocks = enemyBlocks;
                return result;
            }
        }
        else
        {
            return result;
        }
    }
    else
    {
        if (Array.isArray(enemyBlocks) && enemyBlocks.length > 0) {
            // 1. Сортируем массив башен противника по возрастанию жизней
            enemyBlocks = enemyBlocks.sort((a, b) => {
                if (a.isHead === b.isHead) {
                return a.health - b.health;
                }
                return a.isHead ? -1 : 1;
            });
            // 2. Ищем ближайшую башню
            let rBlock = FindBestCoordsByBlock(base, enemyBlocks);
            // 3. Если нашли, возвращаем результат
            if(rBlock.x !== -1 && rBlock.y !== -1) {
                result.x = rBlock.x
                result.y = rBlock.y
                enemyBlocks = rBlock.enemyBlocks
                
                result.enemyBlocks = enemyBlocks;
                return result;
            }
        }
        else if(Array.isArray(zombies) && zombies.length > 0)
        {
            // 1. Сортируем массив зомби по важности
            zombies = zombies.sort((a, b) => {
                const priorityA = typePriority[a.type] || 6;
                const priorityB = typePriority[b.type] || 6;
                return priorityA - priorityB;
            });
            // 2. Ищем ближайшего зомбака
            let zombR = FindBestCoordsByZombie(base, zombies)
            // 3. Если нашли, возвращаем результат
            if(zombR.x !== -1 && zombR.y !== -1) {
                result.x = zombR.x
                result.y = zombR.y
                zombies = zombR.zombies
                
                result.zombies = zombies
                return result;
            }
        }
        else
        {
            return result;
        }
    }


    /**/
}


export const FindBestCoordsByZombie = (base, mas) => {
    let nearest = null;
    let minDist = base.range;
  
    mas.forEach((a) => {
      const dist = Math.sqrt(Math.pow(a.x - base.x, 2) + Math.pow(a.y - base.y, 2));
      if (dist <= minDist) {
        nearest = a;
        minDist = dist;
        if(minDist < 2)
            return;
      }
    });

    if(nearest === null)
        return result = {
            x: -1,
            y: -1,
            zombies: mas
        }
    // удаляем/изменяем жизни у зомби
    const foundZombie = mas.find(z => z.id === nearest.id);
    if (foundZombie) {
        if(foundZombie.health <= base.attack)
            mas = mas.filter(z => z.id !== nearest.id)
        else
            foundZombie.health -= base.attack;
    }

    let result = {
        x: nearest.x,
        y: nearest.y,
        zombies: mas
    }
    return result;
}

export const FindBestCoordsByBlock = (base, mas) => {
    let nearest = null;
    let minDist = base.range;
  
    mas.forEach((a) => {
      const dist = Math.sqrt(Math.pow(a.x - base.x, 2) + Math.pow(a.y - base.y, 2));
      if (dist <= minDist) {
        nearest = a;
        minDist = dist;
        if(minDist < 2)
            return;
      }
    });

    if(nearest === null)
        return result = {
            x: -1,
            y: -1,
            enemyBlocks: mas
        }
    // удаляем/изменяем жизни у башни
    const foundBlock = mas.find(z => z.id === nearest.id);
    if (foundBlock) {
        if(foundBlock.health <= base.attack)
            mas = mas.filter(z => z.id !== nearest.id)
        else
        foundBlock.health -= base.attack;
    }

    let result = {
        x: nearest.x,
        y: nearest.y,
        enemyBlocks: mas
    }
    return result;
}
  // Возвращает готовый attack массива
export const FindTargets = (bases, zombies, enemyBlocks) => {
    let result = []
    let _res = null;
    let _isZombieFirst = true

    bases.forEach((b) => {
        _res = FindTarget(b, zombies, enemyBlocks, _isZombieFirst)
        if(_res.x !== -1 && _res.y !== -1)
        {
            result.push({
                blockId: _res.id,
                target: {
                  x: _res.x,
                  y: _res.y
                }
              })
              zombies = _res.zombies
              enemyBlocks = _res.enemyBlocks
        }
      });
      return result
}

export const CheckMainBlockAndChange = (currentHealth, prevHealth, bases) => {
    if(currentHealth < prevHealth && Array.isArray(bases) && bases.length > 0)
    {
        bases = bases.filter(z => z.isHead !== true)
        bases = bases.sort((a,b) => {
            return b.health - a.health;
        })
        let e = bases[0]
        return {
            x: e.x,
            y: e.y
        }
    }
    else
        return {
            x: -1,
            y: -1
        }
}