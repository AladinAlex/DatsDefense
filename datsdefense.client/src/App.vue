<script setup>
import Map from './components/Map.vue'
import { useMainStore } from '@/store/mainStore'
import { ref } from 'vue'

let mainStore = useMainStore()
let time = ref(mainStore.data.SecondToStart)

let intId;
const start = () => {
  mainStore.StartRound()
  time.value = mainStore.data.SecondToStart
  clearInterval(intId)
  intId = setInterval(() => {
    time.value -= 1;
  }, 1000)
}

const onClick = (x, y, type) => {
  if (type === 1) // нажато на нашу базу
  {
    mainStore.SetRequestMove(x, y)
  }
  if (type === 2) // нажато для строительства
  {
    mainStore.AddBuildToRequest(x, y)
  }
}

start()
</script>

<template>
  <main>
    <div class="split-screen">
      <div class="left-block">
        <Map :size="{ height: 900, width: 900 }" @click="onClick" />
      </div>
      <div class="right-block" style="margin-left: 10px;">
        <Map :size="{ height: 300, width: 300 }" :mini="true" />
        <div>
          <span class="text">Время до старта: {{ time }}</span>
        </div>
        <div>
          <span class="text">Золото: {{ mainStore.data.Gold }} </span>
        </div>
        <!-- <button @click="mainStore.StartRound">Старт</button> -->
        <button @click="start">Старт</button>
        <button @click="mainStore.StopRound">Стоп</button>
        <button @click="mainStore.GoWithoutStart">Без старта запустить логику</button>
        <div class="log">
          <div>
            <span class="text">Логи: </span>
          </div>
          <!-- <div v-for="(log, i) in mainStore.data.CommandResult" :key="i" class="inner_log">
            <span class="text">
              {{ log }}
            </span>
          </div> -->
        </div>

        <div class="error">
          <div>
            <span class="text">Ошибки: </span>
          </div>
          <div v-for="(err, i) in mainStore.data.errors" :key="i" class="inner_error">
            <span class="text">
              {{ err }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      Action:
      <button>Купить клетку</button>
      <button>Перемещение</button>
    </div>
  </main>

</template>

<style lang="scss">
.pp {
  display: flex;
}

.split-screen {
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  display: flex;

  .left-block {
    flex: 7;
    /* Occupy 70% of the available space */
  }

  .right-block {
    flex: 3;
    /* Occupy 30% of the available space */
  }
}

.log {
  margin-top: 20px;
  border: 1px solid gold;

  .inner_log {
    margin: 2px;
    border: 1px solid rgb(41, 94, 50);
  }
}

.error {
  margin-top: 20px;
  border: 1px solid red;

  .inner_error {
    margin: 2px;
    border: 1px solid darksalmon;
  }
}

.text {
  font-size: 12px;
  font-weight: 500;
}
</style>