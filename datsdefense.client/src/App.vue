<script setup>
import Map from './components/Map.vue'
</script>

<template>
  <main>
    <Map :size="{ height: 900, width: 900 }" />
    <Map :size="{ height: 300, width: 300 }" :mini="true" />
    <div>
      Action:
      <button>Купить клетку</button>
      <button>Перемещение</button>
    </div>
  </main>

</template>
