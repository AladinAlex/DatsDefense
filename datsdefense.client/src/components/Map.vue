<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useMainStore } from '@/store/mainStore'

const canvas = ref(null)
const mainStore = useMainStore()
const props = defineProps({
    size: {
        width: 900,
        height: 900
    },
    mini: false
})
const emit = defineEmits(['click'])
const images = {
    base: null,
    normal: null,
    fast: null,
    bomber: null,
    liner: null,
    juggernaut: null,
    chaos_knight: null,
    default: null,
    player: null,
    wall: null,
    enamyBase: null,
    enamyPlayer: null
}
for (const key in images) {
    const img = new Image()
    img.src = `/icons/${key}.png`
    images[key] = img
}
const calculatePercentage = (number, percentage) => {
    return number * (percentage / 100);
}

onMounted(() => {

    const ctx = canvas.value.getContext('2d')
    const gridSize = props.mini ? 1 : 15
    let gridOffsetX = 0
    let gridOffsetY = 0

    const r = canvas.value.height / gridSize

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = props.mini ? 0 : 0.5;

    const state = []

    if (mainStore.data.World.zpots) {
        mainStore.data.World.zpots.forEach(spot => {
            state.push(spot)
        })
    }
    if (mainStore.data.Units.base) {
        mainStore.data.Units.base.forEach(base => {
            state.push({ x: base.x, y: base.y, type: 'base', isHead: base.isHead, health: base.health })
        })
    }
    if (mainStore.data.Units.zombies) {
        mainStore.data.Units.zombies.forEach(zombie => {
            state.push({ x: zombie.x, y: zombie.y, type: zombie.type, isZombie: true, speed: zombie.speed, direction: zombie.direction, health: zombie.health })
        })
    }
    if (mainStore.data.Units.enemyBlocks) {
        mainStore.data.Units.enemyBlocks.forEach(enemy => {
            state.push({ x: enemy.x, y: enemy.y, type: enemy.type, isHead: enemy.isHead, health: enemy.health })
        })
    }
    const drawArrow = (x1, y1, x2, y2) => {
        ctx.strokeStyle = '#0de0d2';
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Рисуем треугольник для стрелки
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var headlen = 5; // длина стрелки
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = '#0de0d2';
        ctx.fill();
    }

    const findRectangleRender = () => {
        const beginX = -gridOffsetX / gridSize,
            beginY = -gridOffsetY / gridSize,
            endX = beginX + r,
            endY = beginY + r
        const zone = {
            begin: {
                x: beginX,
                y: beginY
            },
            end: {
                x: endX,
                y: endY
            }
        }
        return state.filter(p => p.x >= beginX && p.x <= endX && p.y >= beginY && p.y <= endY)
    }
    const drawGrid = () => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 0.5;

        for (let y = 0; y <= canvas.value.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.value.width, y);
        }

        for (let x = 0; x <= canvas.value.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.value.height);
        }

        ctx.stroke()
        const renderObject = findRectangleRender()
        console.log(renderObject)
        if (renderObject.length) {
            renderObject.forEach(p => {
                const x = p.x * gridSize + gridOffsetX, y = p.y * gridSize + gridOffsetY
                ctx.drawImage(images[p.type], x, y, gridSize, gridSize)
                if (!props.mini && p.health) {
                    ctx.fillStyle = '#fc0303';
                    const procent = calculatePercentage(gridSize, 5),
                        diff = gridSize - procent

                    ctx.fillRect(x - procent, y - procent, gridSize, calculatePercentage(gridSize, 5))
                }
                if (p.isHead) {
                    ctx.drawImage(images.player, x, y, gridSize, gridSize)
                }
                // if (p.isZombie && !props.mini && p.type != 'chaos_knight') {
                //     if (p.direction == 'right')
                //         drawArrow(x, y + gridSize / 2, x + p.speed * gridSize, y + gridSize / 2)
                //     else if (p.direction == 'left')
                //         drawArrow(x + p.speed * gridSize, y + gridSize / 2, x, y + gridSize / 2)
                // }
            })
        }
    }
    const moveGrid = (dx, dy) => {
        gridOffsetX += dx;
        gridOffsetY += dy;
        drawGrid();
    }

    if (!props.mini) {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    moveGrid(0, gridSize);
                    break;
                case 'ArrowDown':
                    moveGrid(0, -gridSize);
                    break;
                case 'ArrowLeft':
                    moveGrid(gridSize, 0);
                    break;
                case 'ArrowRight':
                    moveGrid(-gridSize, 0);
                    break;
            }
        })
    }

    const animate = () => {
        requestAnimationFrame(animate);
        drawGrid();
    }

    canvas.value.addEventListener('click', (event) => {
        const rect = canvas.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const xGrid = Math.floor(x / gridSize) - gridOffsetX / gridSize;
        const yGrid = Math.floor(y / gridSize) - gridOffsetY / gridSize;
        const object = state.find(x => x.x == xGrid && x.y == yGrid)

        if (object) {
            if (object.type === 'base') {
                emit('click', { x: object.x, y: object.y, type: 1 })
            }
        }
        else {
            emit('click', { x: xGrid, y: yGrid, type: 2 })
        }
    });
    setTimeout(() => {
        drawGrid();
    }, 5000);
    watch(() => mainStore.world.value, () => {
        state.length = 0
        if (mainStore.data.World.zpots) {
            mainStore.data.World.zpots.forEach(spot => {
                state.push(spot)
            })
        }
        if (mainStore.data.Units.base) {
            mainStore.data.Units.base.forEach(base => {
                state.push({ x: base.x, y: base.y, type: 'base', isHead: base.isHead, health: base.health })
            })
        }
        if (mainStore.data.Units.zombies) {
            mainStore.data.Units.zombies.forEach(zombie => {
                state.push({ x: zombie.x, y: zombie.y, type: zombie.type, isZombie: true, speed: zombie.speed, direction: zombie.direction, health: zombie.health })
            })
        }
        if (mainStore.data.Units.enemyBlocks) {
            mainStore.data.Units.enemyBlocks.forEach(enemy => {
                state.push({ x: enemy.x, y: enemy.y, type: enemy.type, isHead: enemy.isHead, health: enemy.health })
            })
        }
        drawGrid()
    }, { deep: true })
    watch(() => mainStore.units.value, () => {
        state.length = 0
        if (mainStore.data.World.zpots) {
            mainStore.data.World.zpots.forEach(spot => {
                state.push(spot)
            })
        }
        if (mainStore.data.Units.base) {
            mainStore.data.Units.base.forEach(base => {
                state.push({ x: base.x, y: base.y, type: 'base', isHead: base.isHead, health: base.health })
            })
        }
        if (mainStore.data.Units.zombies) {
            mainStore.data.Units.zombies.forEach(zombie => {
                state.push({ x: zombie.x, y: zombie.y, type: zombie.type, isZombie: true, speed: zombie.speed, direction: zombie.direction, health: zombie.health })
            })
        }
        if (mainStore.data.Units.enemyBlocks) {
            mainStore.data.Units.enemyBlocks.forEach(enemy => {
                state.push({ x: enemy.x, y: enemy.y, type: enemy.type, isHead: enemy.isHead, health: enemy.health })
            })
        }
        drawGrid()
    }, { deep: true })
})
</script>
<template>
    <div class="map">
        <canvas ref="canvas" :width="size.width" :height="size.height"></canvas>
    </div>
</template>
