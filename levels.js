// levels.js
const levels = [
    // Level 1
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 200, y: 450, w: 150, h: 20},
            {x: 500, y: 400, w: 150, h: 20}
        ],
        enemies: [],
        spikes: [],
        goalX: 700,
        goalY: 350
    },

    // Level 2
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 450, w: 120, h: 20},
            {x: 300, y: 400, w: 150, h: 20},
            {x: 550, y: 350, w: 120, h: 20}
        ],
        enemies: [{x: 320, y: 360, minX: 300, maxX: 450}],
        spikes: [],
        goalX: 700,
        goalY: 300
    },

    // Level 3
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 450, w: 150, h: 20},
            {x: 300, y: 400, w: 100, h: 20},
            {x: 500, y: 350, w: 150, h: 20}
        ],
        enemies: [],
        spikes: [
            {x: 350, y: 380},
            {x: 355, y: 380}
        ],
        goalX: 700,
        goalY: 300
    },

    // Level 4
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 480, w: 100, h: 20},
            {x: 250, y: 400, w: 100, h: 20},
            {x: 400, y: 320, w: 100, h: 20},
            {x: 550, y: 240, w: 100, h: 20}
        ],
        enemies: [{x: 300, y: 360, minX: 250, maxX: 400}],
        spikes: [],
        goalX: 700,
        goalY: 150
    },

    // Level 5
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 80, h: 20},
            {x: 200, y: 430, w: 80, h: 20},
            {x: 320, y: 380, w: 80, h: 20},
            {x: 440, y: 330, w: 80, h: 20},
            {x: 560, y: 280, w: 80, h: 20}
        ],
        enemies: [{x: 450, y: 290, minX: 440, maxX: 540}],
        spikes: [
            {x: 350, y: 360},
            {x: 355, y: 360}
        ],
        goalX: 700,
        goalY: 200
    },

    // Level 6
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 450, w: 140, h: 20},
            {x: 300, y: 400, w: 140, h: 20},
            {x: 500, y: 350, w: 140, h: 20}
        ],
        enemies: [
            {x: 150, y: 410, minX: 100, maxX: 240},
            {x: 520, y: 310, minX: 500, maxX: 640}
        ],
        spikes: [{x: 400, y: 380}],
        goalX: 680,
        goalY: 300
    },

    // Level 7
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 450, w: 100, h: 20},
            {x: 220, y: 400, w: 100, h: 20},
            {x: 360, y: 350, w: 100, h: 20},
            {x: 500, y: 300, w: 100, h: 20},
            {x: 640, y: 250, w: 100, h: 20}
        ],
        enemies: [],
        spikes: [
            {x: 250, y: 380}, {x: 255, y: 380},
            {x: 390, y: 330}, {x: 395, y: 330},
            {x: 530, y: 280}, {x: 535, y: 280}
        ],
        goalX: 720,
        goalY: 180
    },

    // Level 8
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 480, w: 120, h: 20},
            {x: 280, y: 420, w: 120, h: 20},
            {x: 460, y: 360, w: 120, h: 20},
            {x: 600, y: 300, w: 150, h: 20}
        ],
        enemies: [
            {x: 150, y: 440, minX: 100, maxX: 220},
            {x: 330, y: 380, minX: 280, maxX: 400},
            {x: 510, y: 320, minX: 460, maxX: 580}
        ],
        spikes: [{x: 550, y: 340}],
        goalX: 720,
        goalY: 240
    },

    // Level 9
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 60, h: 20},
            {x: 180, y: 420, w: 60, h: 20},
            {x: 280, y: 360, w: 60, h: 20},
            {x: 380, y: 300, w: 60, h: 20},
            {x: 480, y: 240, w: 60, h: 20},
            {x: 580, y: 180, w: 60, h: 20}
        ],
        enemies: [{x: 200, y: 380, minX: 180, maxX: 280}],
        spikes: [
            {x: 300, y: 340},
            {x: 305, y: 340},
            {x: 500, y: 220}
        ],
        goalX: 700,
        goalY: 120
    },

    // Level 10
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 100, h: 20},
            {x: 200, y: 420, w: 80, h: 20},
            {x: 320, y: 360, w: 100, h: 20},
            {x: 450, y: 300, w: 80, h: 20},
            {x: 570, y: 240, w: 100, h: 20},
            {x: 300, y: 200, w: 80, h: 20}
        ],
        enemies: [
            {x: 250, y: 380, minX: 200, maxX: 300},
            {x: 480, y: 260, minX: 450, maxX: 530}
        ],
        spikes: [
            {x: 350, y: 340},
            {x: 355, y: 340},
            {x: 600, y: 220}
        ],
        goalX: 350,
        goalY: 140
    },

    // Level 11
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 50, y: 480, w: 120, h: 20},
            {x: 100, y: 380, w: 120, h: 20},
            {x: 150, y: 280, w: 120, h: 20},
            {x: 500, y: 450, w: 100, h: 20},
            {x: 550, y: 350, w: 100, h: 20},
            {x: 600, y: 250, w: 100, h: 20}
        ],
        enemies: [
            {x: 180, y: 340, minX: 150, maxX: 270},
            {x: 600, y: 310, minX: 550, maxX: 700}
        ],
        spikes: [
            {x: 200, y: 260},
            {x: 570, y: 330}
        ],
        goalX: 700,
        goalY: 200
    },

    // Level 12
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 600, y: 480, w: 150, h: 20},
            {x: 400, y: 420, w: 150, h: 20},
            {x: 200, y: 360, w: 150, h: 20},
            {x: 500, y: 300, w: 150, h: 20},
            {x: 150, y: 240, w: 150, h: 20}
        ],
        enemies: [{x: 480, y: 260, minX: 450, maxX: 650}],
        spikes: [
            {x: 320, y: 340},
            {x: 325, y: 340},
            {x: 600, y: 280}
        ],
        goalX: 250,
        goalY: 180
    },

    // Level 13
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 100, h: 20},
            {x: 220, y: 450, w: 100, h: 20},
            {x: 360, y: 420, w: 100, h: 20},
            {x: 500, y: 390, w: 100, h: 20},
            {x: 640, y: 360, w: 100, h: 20},
            {x: 750, y: 300, w: 50, h: 20}
        ],
        enemies: [
            {x: 150, y: 440, minX: 80, maxX: 180},
            {x: 290, y: 410, minX: 220, maxX: 360},
            {x: 430, y: 380, minX: 360, maxX: 500},
            {x: 570, y: 350, minX: 500, maxX: 640}
        ],
        spikes: [],
        goalX: 770,
        goalY: 240
    },

    // Level 14
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 150, h: 20},
            {x: 300, y: 480, w: 150, h: 20},
            {x: 520, y: 480, w: 150, h: 20},
            {x: 150, y: 380, w: 120, h: 20},
            {x: 350, y: 380, w: 120, h: 20},
            {x: 550, y: 380, w: 120, h: 20},
            {x: 100, y: 280, w: 150, h: 20},
            {x: 320, y: 280, w: 150, h: 20},
            {x: 540, y: 280, w: 120, h: 20},
            {x: 300, y: 180, w: 150, h: 20}
        ],
        enemies: [
            {x: 200, y: 440, minX: 80, maxX: 230},
            {x: 420, y: 340, minX: 350, maxX: 470}
        ],
        spikes: [
            {x: 250, y: 360},
            {x: 600, y: 260}
        ],
        goalX: 375,
        goalY: 120
    },

    // Level 15
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 50, y: 480, w: 80, h: 20},
            {x: 150, y: 420, w: 80, h: 20},
            {x: 250, y: 360, w: 80, h: 20},
            {x: 350, y: 300, w: 80, h: 20},
            {x: 450, y: 240, w: 80, h: 20},
            {x: 550, y: 180, w: 80, h: 20},
            {x: 650, y: 120, w: 100, h: 20}
        ],
        enemies: [
            {x: 200, y: 380, minX: 150, maxX: 250},
            {x: 400, y: 260, minX: 350, maxX: 450},
            {x: 600, y: 140, minX: 550, maxX: 650}
        ],
        spikes: [
            {x: 280, y: 340},
            {x: 285, y: 340},
            {x: 380, y: 280},
            {x: 385, y: 280},
            {x: 480, y: 220}
        ],
        goalX: 720,
        goalY: 60
    },

    // Level 16
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 120, h: 20},
            {x: 250, y: 430, w: 120, h: 20},
            {x: 420, y: 380, w: 120, h: 20},
            {x: 590, y: 330, w: 120, h: 20},
            {x: 300, y: 250, w: 120, h: 20}
        ],
        enemies: [
            {x: 150, y: 440, minX: 80, maxX: 200},
            {x: 320, y: 390, minX: 250, maxX: 370},
            {x: 490, y: 340, minX: 420, maxX: 540},
            {x: 360, y: 210, minX: 300, maxX: 420}
        ],
        spikes: [
            {x: 300, y: 410},
            {x: 650, y: 310}
        ],
        goalX: 720,
        goalY: 200
    },

        // Level 17
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 350, y: 500, w: 100, h: 20},
            {x: 350, y: 430, w: 100, h: 20},
            {x: 350, y: 360, w: 100, h: 20},
            {x: 350, y: 290, w: 100, h: 20},
            {x: 350, y: 220, w: 100, h: 20},
            {x: 350, y: 150, w: 100, h: 20},
            {x: 100, y: 480, w: 80, h: 20},
            {x: 650, y: 400, w: 80, h: 20}
        ],
        enemies: [
            {x: 400, y: 450, minX: 350, maxX: 450},
            {x: 400, y: 240, minX: 350, maxX: 450}
        ],
        spikes: [
            {x: 320, y: 440},
            {x: 480, y: 240}
        ],
        goalX: 400,
        goalY: 80
    },

    // Level 18
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 480, w: 100, h: 20},
            {x: 250, y: 480, w: 100, h: 20},
            {x: 400, y: 480, w: 100, h: 20},
            {x: 550, y: 480, w: 100, h: 20},
            {x: 700, y: 480, w: 100, h: 20},
            {x: 50, y: 380, w: 100, h: 20},
            {x: 200, y: 380, w: 100, h: 20},
            {x: 350, y: 380, w: 100, h: 20},
            {x: 500, y: 380, w: 100, h: 20},
            {x: 650, y: 380, w: 100, h: 20},
            {x: 150, y: 280, w: 100, h: 20},
            {x: 300, y: 280, w: 100, h: 20},
            {x: 450, y: 280, w: 100, h: 20},
            {x: 600, y: 280, w: 100, h: 20},
            {x: 400, y: 180, w: 100, h: 20}
        ],
        enemies: [
            {x: 200, y: 440, minX: 100, maxX: 300},
            {x: 550, y: 340, minX: 500, maxX: 650}
        ],
        spikes: [
            {x: 500, y: 460},
            {x: 505, y: 460}
        ],
        goalX: 450,
        goalY: 120
    },

    // Level 19
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 60, y: 470, w: 90, h: 20},
            {x: 180, y: 410, w: 90, h: 20},
            {x: 300, y: 350, w: 90, h: 20},
            {x: 420, y: 290, w: 90, h: 20},
            {x: 540, y: 230, w: 90, h: 20},
            {x: 660, y: 170, w: 90, h: 20},
            {x: 200, y: 260, w: 80, h: 20},
            {x: 500, y: 380, w: 80, h: 20}
        ],
        enemies: [
            {x: 150, y: 430, minX: 60, maxX: 180},
            {x: 280, y: 370, minX: 200, maxX: 390},
            {x: 400, y: 310, minX: 300, maxX: 510},
            {x: 580, y: 250, minX: 540, maxX: 660}
        ],
        spikes: [
            {x: 210, y: 390},
            {x: 330, y: 330},
            {x: 450, y: 270},
            {x: 570, y: 210},
            {x: 250, y: 240},
            {x: 530, y: 360}
        ],
        goalX: 710,
        goalY: 100
    },

    // Level 20
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 50, y: 480, w: 100, h: 20},
            {x: 200, y: 420, w: 100, h: 20},
            {x: 350, y: 360, w: 100, h: 20},
            {x: 500, y: 300, w: 100, h: 20},
            {x: 650, y: 240, w: 100, h: 20},
            {x: 150, y: 300, w: 80, h: 20},
            {x: 450, y: 420, w: 80, h: 20},
            {x: 700, y: 120, w: 80, h: 20}
        ],
        enemies: [
            {x: 120, y: 440, minX: 50, maxX: 150},
            {x: 270, y: 380, minX: 200, maxX: 300},
            {x: 420, y: 320, minX: 350, maxX: 450},
            {x: 570, y: 260, minX: 500, maxX: 650},
            {x: 180, y: 260, minX: 150, maxX: 230}
        ],
        spikes: [
            {x: 220, y: 400},
            {x: 500, y: 340},
            {x: 650, y: 280},
            {x: 300, y: 240},
            {x: 700, y: 260}
        ],
        goalX: 740,
        goalY: 60
    },

    // Level 21 - Introduction to Shellshots
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 120, h: 20},
            {x: 280, y: 440, w: 120, h: 20},
            {x: 480, y: 400, w: 120, h: 20},
            {x: 680, y: 360, w: 100, h: 20},
            {x: 200, y: 320, w: 100, h: 20},
            {x: 500, y: 280, w: 100, h: 20},
            {x: 350, y: 180, w: 100, h: 20}
        ],
        enemies: [],
        shellshots: [
            {x: 330, y: 400, dir: 1, scamperMinX: 280, scamperMaxX: 400},
            {x: 630, y: 320, dir: -1, scamperMinX: 550, scamperMaxX: 700}
        ],
        spikes: [
            {x: 250, y: 300},
            {x: 550, y: 260}
        ],
        goalX: 400,
        goalY: 120
    },

    // Level 22 - Shellshots and Shellers
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 60, y: 480, w: 100, h: 20},
            {x: 200, y: 430, w: 100, h: 20},
            {x: 340, y: 380, w: 100, h: 20},
            {x: 480, y: 330, w: 100, h: 20},
            {x: 620, y: 280, w: 100, h: 20},
            {x: 150, y: 300, w: 80, h: 20},
            {x: 420, y: 260, w: 80, h: 20},
            {x: 700, y: 150, w: 80, h: 20}
        ],
        enemies: [],
        shellshots: [
            {x: 550, y: 290, dir: -1, scamperMinX: 480, scamperMaxX: 620}
        ],
        spikes: [
            {x: 180, y: 410},
            {x: 360, y: 360},
            {x: 500, y: 310}
        ],
        goalX: 740,
        goalY: 90
    },

    // Level 23 - Narrow Platforms and Multiple Threats
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 50, y: 470, w: 70, h: 20},
            {x: 150, y: 420, w: 70, h: 20},
            {x: 250, y: 370, w: 70, h: 20},
            {x: 350, y: 320, w: 70, h: 20},
            {x: 450, y: 270, w: 70, h: 20},
            {x: 550, y: 220, w: 70, h: 20},
            {x: 650, y: 170, w: 70, h: 20},
            {x: 200, y: 280, w: 60, h: 20},
            {x: 500, y: 380, w: 60, h: 20}
        ],
        enemies: [
            {x: 200, y: 380, minX: 150, maxX: 300}
        ],
        shellshots: [
            {x: 300, y: 420, dir: 1, scamperMinX: 250, scamperMaxX: 380},
            {x: 600, y: 240, dir: 1, scamperMinX: 550, scamperMaxX: 700}
        ],
        spikes: [
            {x: 280, y: 350},
            {x: 420, y: 300},
            {x: 520, y: 200}
        ],
        goalX: 700,
        goalY: 110
    },

    // Level 24 - Chaotic Mix
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 480, w: 100, h: 20},
            {x: 280, y: 480, w: 80, h: 20},
            {x: 420, y: 480, w: 80, h: 20},
            {x: 580, y: 480, w: 100, h: 20},
            {x: 60, y: 380, w: 100, h: 20},
            {x: 220, y: 380, w: 100, h: 20},
            {x: 380, y: 380, w: 100, h: 20},
            {x: 540, y: 380, w: 100, h: 20},
            {x: 700, y: 380, w: 80, h: 20},
            {x: 150, y: 280, w: 100, h: 20},
            {x: 350, y: 280, w: 100, h: 20},
            {x: 550, y: 280, w: 100, h: 20},
            {x: 400, y: 170, w: 100, h: 20}
        ],
        enemies: [
            {x: 200, y: 440, minX: 100, maxX: 280},
            {x: 500, y: 340, minX: 420, maxX: 580}
        ],
        shellshots: [
            {x: 320, y: 340, dir: 1, scamperMinX: 220, scamperMaxX: 420},
            {x: 580, y: 240, dir: -1, scamperMinX: 540, scamperMaxX: 700}
        ],
        spikes: [
            {x: 240, y: 360},
            {x: 450, y: 360},
            {x: 600, y: 260},
            {x: 180, y: 260}
        ],
        goalX: 450,
        goalY: 110
    },

    // Level 25 - Ultimate Challenge
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 70, y: 480, w: 90, h: 20},
            {x: 200, y: 440, w: 90, h: 20},
            {x: 330, y: 400, w: 90, h: 20},
            {x: 460, y: 360, w: 90, h: 20},
            {x: 590, y: 320, w: 90, h: 20},
            {x: 720, y: 280, w: 70, h: 20},
            {x: 150, y: 320, w: 80, h: 20},
            {x: 400, y: 240, w: 80, h: 20},
            {x: 650, y: 180, w: 80, h: 20},
            {x: 300, y: 140, w: 100, h: 20}
        ],
        enemies: [
            {x: 250, y: 400, minX: 200, maxX: 330},
            {x: 540, y: 280, minX: 460, maxX: 620}
        ],
        shellshots: [
            {x: 400, y: 360, dir: -1, scamperMinX: 330, scamperMaxX: 460},
            {x: 450, y: 220, dir: 1, scamperMinX: 400, scamperMaxX: 550},
            {x: 350, y: 100, dir: 1, scamperMinX: 300, scamperMaxX: 450}
        ],
        spikes: [
            {x: 280, y: 380},
            {x: 410, y: 340},
            {x: 540, y: 300},
            {x: 200, y: 300},
            {x: 450, y: 220},
            {x: 700, y: 160}
        ],
        goalX: 350,
        goalY: 60
    },

    // Level 26 - Introduction to Floaters
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 100, y: 480, w: 120, h: 20},
            {x: 300, y: 420, w: 120, h: 20},
            {x: 500, y: 360, w: 120, h: 20},
            {x: 200, y: 300, w: 100, h: 20},
            {x: 500, y: 240, w: 100, h: 20}
        ],
        enemies: [
            {x: 350, y: 300, type: "floater", minY: 250, maxY: 400}
        ],
        spikes: [{x: 600, y: 340}],
        goalX: 720,
        goalY: 200
    },

    // Level 27 - Floaters and Walkers
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 80, y: 480, w: 100, h: 20},
            {x: 220, y: 440, w: 100, h: 20},
            {x: 360, y: 400, w: 100, h: 20},
            {x: 500, y: 360, w: 100, h: 20},
            {x: 100, y: 320, w: 80, h: 20},
            {x: 500, y: 280, w: 80, h: 20},
            {x: 650, y: 240, w: 100, h: 20}
        ],
        enemies: [
            {x: 150, y: 400, minX: 80, maxX: 220},
            {x: 400, y: 270, type: "floater", minY: 200, maxY: 340},
            {x: 620, y: 200, minX: 500, maxX: 750}
        ],
        spikes: [
            {x: 280, y: 420},
            {x: 450, y: 380}
        ],
        goalX: 700,
        goalY: 150
    },

    // Level 28 - Multiple Floaters
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 50, y: 480, w: 90, h: 20},
            {x: 180, y: 440, w: 90, h: 20},
            {x: 310, y: 400, w: 90, h: 20},
            {x: 440, y: 360, w: 90, h: 20},
            {x: 570, y: 320, w: 90, h: 20},
            {x: 700, y: 280, w: 80, h: 20},
            {x: 200, y: 300, w: 70, h: 20},
            {x: 500, y: 240, w: 70, h: 20}
        ],
        enemies: [
            {x: 250, y: 350, type: "floater", minY: 280, maxY: 420},
            {x: 550, y: 280, type: "floater", minY: 200, maxY: 360},
            {x: 400, y: 280, minX: 310, maxX: 440}
        ],
        spikes: [
            {x: 100, y: 460},
            {x: 350, y: 380},
            {x: 650, y: 300}
        ],
        goalX: 740,
        goalY: 200
    },

    // Level 29 - Floaters with Shellshots
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 70, y: 480, w: 100, h: 20},
            {x: 220, y: 440, w: 100, h: 20},
            {x: 370, y: 400, w: 100, h: 20},
            {x: 520, y: 360, w: 100, h: 20},
            {x: 670, y: 320, w: 100, h: 20},
            {x: 150, y: 300, w: 80, h: 20},
            {x: 500, y: 260, w: 80, h: 20}
        ],
        enemies: [
            {x: 300, y: 340, type: "floater", minY: 260, maxY: 400},
            {x: 600, y: 280, type: "floater", minY: 200, maxY: 360}
        ],
        shellshots: [
            {x: 400, y: 320, dir: 1, scamperMinX: 370, scamperMaxX: 520}
        ],
        spikes: [
            {x: 180, y: 420},
            {x: 420, y: 380},
            {x: 650, y: 300}
        ],
        goalX: 720,
        goalY: 240
    },

    // Level 30 - Floater Gauntlet
    {
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},
            {x: 60, y: 480, w: 80, h: 20},
            {x: 180, y: 430, w: 80, h: 20},
            {x: 300, y: 380, w: 80, h: 20},
            {x: 420, y: 330, w: 80, h: 20},
            {x: 540, y: 280, w: 80, h: 20},
            {x: 660, y: 230, w: 80, h: 20},
            {x: 150, y: 300, w: 70, h: 20},
            {x: 450, y: 220, w: 70, h: 20}
        ],
        enemies: [
            {x: 200, y: 360, type: "floater", minY: 280, maxY: 420},
            {x: 380, y: 300, type: "floater", minY: 220, maxY: 380},
            {x: 560, y: 240, type: "floater", minY: 160, maxY: 320},
            {x: 320, y: 240, minX: 300, maxX: 420}
        ],
        shellshots: [
            {x: 250, y: 340, dir: 1, scamperMinX: 180, scamperMaxX: 300},
            {x: 600, y: 200, dir: -1, scamperMinX: 540, scamperMaxX: 660}
        ],
        spikes: [
            {x: 120, y: 460},
            {x: 240, y: 410},
            {x: 360, y: 360},
            {x: 480, y: 300},
            {x: 600, y: 260},
            {x: 200, y: 280}
        ],
        goalX: 710,
        goalY: 150
    }
];