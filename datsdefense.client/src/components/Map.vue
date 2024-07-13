<script setup>
import { ref, onMounted } from 'vue'
const canvas = ref(null)

const props = defineProps({
    base: Array,
    wall: Array,
    zombies: Array,
    enemyBlocks: Array,
    zpots: Array
})
const colors = {
    zombie: {
        normal: null,
        fast: null,
        bomber: null,
        liner: null,
        juggernaut: null,
        chaos_knight: null,
        tombstone: null,
    },
    player: null,
    wall: null,
    base: '#008000',
    blue: '#0000FF',
    selected: '#FFD700' // Золотой цвет для выделения
};
for (const key in colors.zombie) {
    const img = new Image()
    img.src = `/icons/zombie/${key}.png`
    colors.zombie[key] = img
}
const imgWall = new Image()
imgWall.src = `/icons/wall.png`
colors.wall = imgWall
const imgPlayer = new Image()
imgPlayer.src = `/icons/player.png`
colors.player = imgPlayer

onMounted(() => {

    const ctx = canvas.value.getContext('2d')
    const gridSize = 30
    let gridOffsetX = 0
    let gridOffsetY = 0

    const r = canvas.value.height / gridSize

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.5;


    const gridState = Array.from({ length: r }, () => Array.from({ length: r }))

    // Изначальные квадраты
    gridState[1][1] = colors.blue;
    gridState[1][3] = colors.blue;
    gridState[2][2] = colors.red;

    gridState[1][8] = colors.blue;
    gridState[2][7] = colors.red;

    gridState[5][7] = colors.green;
    gridState[4][8] = colors.red;
    gridState[1][8] = colors.blue;

    // Функция для рисования сетки
    const drawGrid = () => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1; // Толщина линий сетки

        for (let y = 0; y <= canvas.value.height; y += gridSize) {
            ctx.moveTo(0, y + gridOffsetY);
            ctx.lineTo(canvas.value.width, y + gridOffsetY);
        }

        for (let x = 0; x <= canvas.value.width; x += gridSize) {
            ctx.moveTo(x + gridOffsetX, 0);
            ctx.lineTo(x + gridOffsetX, canvas.value.height);
        }

        for (let y = 0; y < r; y++) {
            for (let x = 0; x < r; x++) {
                if (gridState[y][x]) {
                    ctx.drawImage(colors.zombie.tombstone, x * gridSize, y * gridSize, gridSize, gridSize)
                }
            }
        }

        ctx.stroke();
    }
    const moveGrid = (dx, dy) => {
        gridOffsetX += dx;
        gridOffsetY += dy;
        drawGrid();
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                moveGrid(0, -gridSize);
                break;
            case 'ArrowDown':
                moveGrid(0, gridSize);
                break;
            case 'ArrowLeft':
                moveGrid(-gridSize, 0);
                break;
            case 'ArrowRight':
                moveGrid(gridSize, 0);
                break;
        }
    })

    const animate = () => {
        requestAnimationFrame(animate);
        drawGrid();
    }

    canvas.value.addEventListener('click', (event) => {
        const rect = canvas.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / gridSize);
        const row = Math.floor(y / gridSize);

        // Переключение цвета выделения
        gridState[row][col] = gridState[row][col] === colors.selected ? colors.lightgreen : colors.selected;

        drawGrid();
    });
    // Рисование сетки
    setTimeout(() => {
        drawGrid();
    }, 5000)
})
</script>
<template>
    <div class="map">
        <canvas ref="canvas" width="2400" height="2400"></canvas>
    </div>
</template>
