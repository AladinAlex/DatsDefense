// import PlayService from '@/openapi/services/PlayService'
import { reactive } from 'vue'
import ApiService from '@/utils/ApiService'
import { FindTargets, CheckMainBlockAndChange, GetBuilds } from '@/utils/logica'
import { defineStore }  from 'pinia'


export const useMainStore = defineStore('main', () => {

    const data = reactive({
        errors: [],
        SecondToStart: 999,
        World: {},
        Units: {},
        Request: {},
        CommandResult: [],
        MainBlockHealth: 300,
        GameIsStart: false,
        IntervalId: 0,
        timeoutId: 0,
        sendWorld: 1,
        Gold: 10,
    })

    const StartRound = async() => {
        let response = await ApiService.Participate()
        if(response && !response.error && response.startsInSec)
        {
            data.SecondToStart = response.startsInSec
            clearTimeout(data.timeoutId)
            data.timeoutId = setTimeout(async () => {
                await GoWithoutStart()
                data.GameIsStart = true
            }, (data.SecondToStart * 1000) + 150);
        }
        else
            data.errors.push(response.error ?? "Ошибка при старте приложения")
    }

    const GoWithoutStart = async () => {
        await getUnits()
        if(data.sendWorld < 4)
        {
            await getWorld()
            data.sendWorld++
        }
        else
            data.sendWorld = 1
        await AutoGame()
    }

    const AutoGame = async () => {
        let intervalId = setInterval(SendComamnd, 1850);
        data.IntervalId = intervalId
    }

    const SendComamnd = async() => {
        GenerateRequest()
        let response = await ApiService.Command(data.Request)
        if(response && !response.error)
        {
            data.CommandResult.push(response)
            setTimeout(async () => {
                await getUnits()
                await getWorld()
            }, 150)
        }
    }

    const getUnits = async () => {
        let _rUnits = await ApiService.Units();
        if(_rUnits && !_rUnits.error)
        {
            data.Units = _rUnits
            if(data.Units.base === null)
                StopRound()
            else{
                data.Gold = data.Units.player.gold
            }
        }
        else
            data.errors.push(_rUnits.error ?? "Ошибка при получении units")
    }

    const getWorld = async () => {
        let _rWorld = await ApiService.World();
        if(_rWorld && !_rWorld.error)
            data.World = _rWorld
        else
            data.errors.push(_rWorld.error ?? "Ошибка при получении world")
    }

    const GenerateRequest = () => {
        console.log('IN GENERATE REQUEST METHOD, data = ', data)
        let __rr = {
            attack: [],
            build: [],
            moveBase: null
          }
          __rr.attack = FindTargets(data.Units.base, data.Units.zombies, data.Units.enemyBlocks)

        const foundBase = data.Units.base?.find(z => z.isHead === true);
        if(foundBase) {
            let moveBlock = CheckMainBlockAndChange(foundBase.health, data.MainBlockHealth, data.Units.base)
            if(moveBlock.x !== -1 && moveBlock.y !== -1 )
                __rr.moveBase = {
                    x: moveBlock.x,
                    y: moveBlock.y
                }
            data.MainBlockHealth = foundBase.health
        }

        let zpts = data.World.zpots?.filter(x => x.type === 'default')
        let wls = data.World.zpots?.filter(x => x.type === 'wall')
        let newBlock = GetBuilds(data.Units.base, data.Units.enemyBlocks, data.Units.zombies, zpts, wls)
        console.log('newBlock', newBlock)
        __rr.build = newBlock

        data.Request = __rr
    }

    const SetRequestMove = (x, y) => {
        data.Request.moveBase = {
            x: x,
            y: y
          }
    }

    const AddBuildToRequest = (x, y) => {
        let existsNewwBlock = data.Request.build?.find(b => b.x === x && b.y === y)
        if(!existsNewwBlock)
            data.Request.build.push(
                {
                    x: x,
                    y: y
                },
            )
    }

    const StopRound = () => {
        clearInterval(data.IntervalId)
        data.errors = []
        data.SecondToStart = 999
        data.World = {}
        data.Units = {}
        data.Request = {}
        data.CommandResult = []
        data.MainBlockHealth = 300
        data.GameIsStart = false
        data.IntervalId = 0
        data.sendWorld = 1
        data.Gold = 10
    }


    return { data, StartRound, SetRequestMove, AddBuildToRequest, StopRound, GoWithoutStart }
})
