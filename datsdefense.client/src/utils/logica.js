import { transformVNodeArgs } from "vue";

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

    return result
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
        return {
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
    if(!Array.isArray(bases) || bases.length < 1)
        return result

    bases.forEach((b) => {
        _res = FindTarget(b, zombies, enemyBlocks, _isZombieFirst)
        console.log('(FindTargets)_res:', _res)
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
        if(e && e.x && e.y)
            return {
                x: e.x,
                y: e.y
            }
        else
        return {
            x: -1,
            y: -1
        }
    }
    else
        return {
            x: -1,
            y: -1
        }
}

export const GetBuilds = (bases, enemyBlocks, zombies, zpots, wall, gold) => {
    let allNewBlocks = []
    console.log('start get builds')
    if(!Array.isArray(bases) || bases.length < 1)
        {
            console.log('bases is empty')
            return allNewBlocks
        }
        console.log('ВСЕ НАШИ БАЗЫ ПРИ постройке нового', bases)
    let r;
    bases?.forEach((a) => {
        r = GetBuild(a, bases, enemyBlocks, zombies, zpots, wall, gold)
        console.log('СМОТРИ СЮДА!', r)
        allNewBlocks = allNewBlocks.concat(r)
    });
    
    console.log('return allNewBlocks', allNewBlocks)
      return allNewBlocks
}

export const GetBuild = (base, bases, enemyBlocks, zombies, zpots, wall, gold) => {
    let response = []
    // 1. Проверка голды
    if(gold < 1)
        return response

    // 1. Сверху
    let u = CheckToBuild(base.x, base.y-1, bases, enemyBlocks, zombies, zpots, wall)
    if(u) {   
        response.push(    {
            x: base.x,
            y: base.y-1
        })
        gold--
    }
    // 2. Справа
    let r = CheckToBuild(base.x+1, base.y, bases, enemyBlocks, zombies, zpots, wall)
    if(r && gold > 0)
    {
        response.push(    {
            x: base.x+1,
            y: base.y
        })
        gold--
    }
    // 3. Снизу
    let d = CheckToBuild(base.x, base.y+1, bases, enemyBlocks, zombies, zpots, wall)
    if(d && gold > 0) {
        response.push({
            x: base.x,
            y: base.y+1
        })
        gold--
    }
    // 4. Слева
    let l = CheckToBuild(base.x-1, base.y, bases, enemyBlocks, zombies, zpots, wall)
    if(l && gold > 0) {
        response.push(    {
            x: base.x-1,
            y: base.y
        })
        gold--
    }
    
    return response
}

// проверка потенциального блока
export const CheckToBuild = (x, y, bases, enemyBlocks, zombies, zpots, wall) => {

    const existBase = bases?.find(b => b.x === x && b.y === y)
    if(existBase) {
        console.log('Проблема в НАШЕЙ БАЗЕ')  
        return false
    }

    const existZombie = zombies?.find(zmb => zmb.x === x && zmb.y === y )
    if(existZombie) {
        console.log('Проблема в ЗОМБИ')  
        return false
    }
    
    // const existEnemyBlock = enemyBlocks?.find(eb => eb.x === x && eb.y === y )
    // if(existEnemyBlock)
    //     return false

    let existEnemyNear = true
    if(Array.isArray(enemyBlocks) && enemyBlocks.length> 0)
    for (const opponentBaseCoords of enemyBlocks) {
        // Вычислить расстояние между текущими координатами и координатами базы оппонента
        const distance = calculateDistance({x: x, y: y}, opponentBaseCoords);
        // Если расстояние меньше 1 клетки, вернуть false (нельзя строить)
        if (distance < 1) {
            existEnemyNear = false
            return;
        }
    }

    if(!existEnemyNear) {
        console.log('Проблема в СОСЕДЕ')  
        return false
    }

    let existZpotNear = canBuildBaseBlock(x, y, zpots)
    if(!existZpotNear) {
        console.log('Проблема в СПОТЕ')  
        return false
    }

    let existWallNear = canBuildBaseBlock(x, y, wall)
    if(!existWallNear) {
        console.log('Проблема в СТЕНЕ')  
        return false
    }

    return true
}

function calculateDistance(point1, point2) {
    const deltaX = point1.x - point2.x;
    const deltaY = point1.y - point2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function canBuildBaseBlock(x, y, zombieSpots) {
    // Проверить каждый элемент массива zombieSpots
    if(Array.isArray(zombieSpots) && zombieSpots.length> 0)
    for (const zombieSpot of zombieSpots) {
      // Вычислить расстояние между текущими координатами и клеткой зомби
    //   const distanceToZombie = calculateDistance({x: x, y: y}, zombieSpot);
  
      // Если расстояние по горизонтали или вертикали равно 1 клетке, вернуть false (нельзя строить)
      if (Math.abs(x - zombieSpot.x) === 1 || Math.abs(y - zombieSpot.y) === 1) {
        return false;
      }
    }  
    // Если ни одна база оппонента или клетка зомби не находится в запретной зоне, вернуть true (можно строить)
    return true;
  }