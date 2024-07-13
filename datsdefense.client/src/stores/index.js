// import PlayService from '@/openapi/services/PlayService'
import { reactive } from 'vue'
import ApiService from '@/utils/ApiService'
import { FindTargets, CheckMainBlockAndChange } from '@/utils/logica'
import { defineStore }  from 'pinia'


export const useProductStore = defineStore('main', () => {

    const data = reactive({
        errors: [],
        SecondToStart: 999,
        World: {},
        Units: {},
        Request: {},
        CommandResult: [],
        MainBlockHealth: 300,
        GameIsStart: false,
        IntervalId: 0
    })

    const StartRound = async() => {
        let response = await ApiService.Participate()
        if(response && !response.error && response.startsInSec)
        {
            data.SecondToStart = response.startsInSec
            setTimeout(async () => {
                await getUnits()
                await getWorld()
                await AutoGame()
                data.GameIsStart = true
            }, (data.SecondToStart * 1000) + 150);
        }
        else
            data.errors.push(response.error)
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
            data.Units = _rUnits.data
        }
        else
            data.errors.push(_rUnits.error)
    }

    const getWorld = async () => {
        let _rWorld = await ApiService.World();
        if(_rWorld && !_rWorld.error)
            data.World = _rWorld.data
        else
            data.errors.push(_rWorld.error)
    }

    const GenerateRequest = () => {
        let __rr = {
            attack: [],
            build: [],
            moveBase: null
          }
          __rr.attack = FindTargets()

        const foundBase = data.Units.base.find(z => z.isHead === true);
        let moveBlock = CheckMainBlockAndChange(foundBase.health, data.MainBlockHealth, data.Units.base)
        if(moveBlock.x !== -1 && moveBlock.y !== -1 )
            __rr.moveBase = {
                x: moveBlock.x,
                y: moveBlock.y
              }
         __rr.moveBase

         data.MainBlockHealth = foundBase.health

        data.Request = __rr
    }

    const SetRequestMove = (x, y) => {
        data.Request.moveBase = {
            x: x,
            y: y
          }
    }

    const AddBuildToRequest = (x, y) => {
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
    }


    return { data, StartRound, SetRequestMove, AddBuildToRequest, StopRound }
})
