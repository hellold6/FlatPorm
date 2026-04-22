const gameContainer = document.getElementById("gameContainer");
const player = document.getElementById("player");
const uiLevel = document.getElementById("levelNum");
const uiLives = document.getElementById("lives");
const uiMaxLevel = document.getElementById("maxLevelNum");
const gameOverDiv = document.getElementById("gameOver");
const mainMenu = document.getElementById("mainMenu");
const pauseOverlay = document.getElementById("pauseOverlay");
const settingsPanel = document.getElementById("settingsPanel");
const levelUploadInput = document.getElementById("levelUpload");

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;

let currentLevel = 1;
let lives = 3;
let gameActive = true;
let gameStarted = false;
let paused = false;

let playerX = 50;
let playerY = 450;
let playerVelY = 0;
let playerVelX = 0;

let maxLevels = Array.isArray(levels) ? levels.length : 20;
let invincible = false;
let loadedCustomLevelCount = 0;

let musicVolume = 0.6;
let sfxVolume = 0.8;

const PLAYER_HITBOX_WIDTH = 30;
const PLAYER_HITBOX_HEIGHT = 24;
const ENEMY_HITBOX_WIDTH = 34;
const ENEMY_HITBOX_HEIGHT = 30;
const SPIKE_HITBOX_WIDTH = 40;
const SPIKE_HITBOX_HEIGHT = 37;
const GOAL_HITBOX_WIDTH = 42;
const GOAL_HITBOX_HEIGHT = 41;

const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const MOVE_SPEED = 5;
const JUMP_CUTOFF_MULTIPLIER = 0.45;

const COYOTE_FRAMES = 8;
const JUMP_BUFFER_FRAMES = 8;
let coyoteTimer = 0;
let jumpBufferTimer = 0;
let wasJumpHeld = false;

const keys = {};
const touchKeys = {
    ArrowLeft: false,
    ArrowRight: false,
    Jump: false
};

let platformEls = [];
let enemyEls = [];
let spikeEls = [];
let goalEl = null;

const devMenu = document.getElementById("devMenu");
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;

function fitGameToViewport() {
    const scale = Math.min(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
    document.documentElement.style.setProperty("--game-scale", String(Math.max(0.45, scale)));
}

function syncMaxLevelUI() {
    maxLevels = levels.length;
    uiMaxLevel.textContent = String(maxLevels);
}

function isColliding(x, y, w, h, px, py, pw, ph) {
    return x < px + pw && x + w > px && y < py + ph && y + h > py;
}

function getPlayerWidth() {
    return Number(player.dataset.hitboxWidth || PLAYER_HITBOX_WIDTH);
}

function getPlayerHeight() {
    return Number(player.dataset.hitboxHeight || PLAYER_HITBOX_HEIGHT);
}

function setTouchButtonActiveState(key, active) {
    const button = document.querySelector(`[data-touch-key="${key}"]`);
    if (!button) return;
    button.classList.toggle("active", active);
}

function setTouchKey(key, active) {
    touchKeys[key] = active;
    setTouchButtonActiveState(key, active);
}

function isLeftPressed() {
    return keys.ArrowLeft || keys.a || touchKeys.ArrowLeft;
}

function isRightPressed() {
    return keys.ArrowRight || keys.d || touchKeys.ArrowRight;
}

function isJumpPressed() {
    return keys.ArrowUp || keys.w || keys[" "] || touchKeys.Jump;
}

function clearWorldObjects() {
    gameContainer.querySelectorAll(".platform, .enemy, .spike, .goal").forEach((el) => el.remove());
    platformEls = [];
    enemyEls = [];
    spikeEls = [];
    goalEl = null;
}

function normalizeRuntimeLevels() {
    if (!window.LevelSchema) return;

    for (let i = 0; i < levels.length; i++) {
        levels[i] = window.LevelSchema.normalizeLevel(levels[i]);
    }
}

function findSpikeAnchorY(spikeX) {
    let anchorY = null;

    for (let i = 0; i < platformEls.length; i++) {
        const plat = platformEls[i];
        const px = Number(plat.style.left.replace("px", ""));
        const py = Number(plat.style.top.replace("px", ""));
        const pw = Number(plat.dataset.hitboxWidth);

        if (spikeX + SPIKE_HITBOX_WIDTH > px && spikeX < px + pw) {
            if (anchorY === null || py < anchorY) {
                anchorY = py;
            }
        }
    }

    return anchorY;
}

function loadLevel(levelNum) {
    currentLevel = levelNum;
    uiLevel.textContent = String(currentLevel);
    clearWorldObjects();

    const rawLevel = levels[levelNum - 1];
    const level = window.LevelSchema ? window.LevelSchema.normalizeLevel(rawLevel) : rawLevel;

    level.platforms.forEach((p) => {
        const platformEl = document.createElement("div");
        platformEl.className = "platform";
        platformEl.style.left = `${p.x}px`;
        platformEl.style.top = `${p.y}px`;
        platformEl.style.width = `${p.w}px`;
        platformEl.style.height = `${p.h}px`;
        platformEl.dataset.hitboxWidth = String(p.w);
        platformEl.dataset.hitboxHeight = String(p.h);
        platformEls.push(platformEl);
        gameContainer.appendChild(platformEl);
    });

    level.enemies.forEach((e) => {
        const enemyEl = document.createElement("div");
        enemyEl.className = "enemy";
        enemyEl.style.left = `${e.x}px`;
        enemyEl.style.top = `${e.y}px`;
        enemyEl.dataset.minx = String(e.minX);
        enemyEl.dataset.maxx = String(e.maxX);
        enemyEl.dataset.vx = "2";
        enemyEl.dataset.hitboxWidth = String(e.hitboxW || ENEMY_HITBOX_WIDTH);
        enemyEl.dataset.hitboxHeight = String(e.hitboxH || ENEMY_HITBOX_HEIGHT);
        enemyEls.push(enemyEl);
        gameContainer.appendChild(enemyEl);
    });

    level.spikes.forEach((s) => {
        const spikeEl = document.createElement("div");
        spikeEl.className = "spike";
        spikeEl.style.left = `${s.x}px`;

        const anchorY = findSpikeAnchorY(s.x);
        if (anchorY !== null) {
            spikeEl.style.top = `${anchorY - SPIKE_HITBOX_HEIGHT}px`;
        } else {
            spikeEl.style.top = `${s.y}px`;
        }

        spikeEl.dataset.hitboxWidth = String(s.hitboxW || SPIKE_HITBOX_WIDTH);
        spikeEl.dataset.hitboxHeight = String(s.hitboxH || SPIKE_HITBOX_HEIGHT);
        spikeEls.push(spikeEl);
        gameContainer.appendChild(spikeEl);
    });

    goalEl = document.createElement("div");
    goalEl.className = "goal";
    goalEl.style.left = `${level.goalX}px`;
    goalEl.style.top = `${level.goalY}px`;
    goalEl.dataset.hitboxWidth = String(level.goalW || GOAL_HITBOX_WIDTH);
    goalEl.dataset.hitboxHeight = String(level.goalH || GOAL_HITBOX_HEIGHT);
    gameContainer.appendChild(goalEl);

    playerX = 50;
    playerY = 450;
    playerVelY = 0;
    playerVelX = 0;
    coyoteTimer = 0;
    jumpBufferTimer = 0;
    player.dataset.hitboxWidth = String(PLAYER_HITBOX_WIDTH);
    player.dataset.hitboxHeight = String(PLAYER_HITBOX_HEIGHT);
    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateEnemies() {
    for (let i = 0; i < enemyEls.length; i++) {
        const enemy = enemyEls[i];
        let x = Number(enemy.style.left.replace("px", ""));
        const minX = Number(enemy.dataset.minx);
        const maxX = Number(enemy.dataset.maxx);
        let vx = Number(enemy.dataset.vx);

        x += vx;
        if (x <= minX || x >= maxX) {
            vx *= -1;
            x += vx;
        }

        enemy.style.left = `${x}px`;
        enemy.dataset.vx = String(vx);
    }
}

function checkCollisions() {
    let isOnGround = false;
    let hitHazard = false;
    let hitGoal = false;

    const pw = getPlayerWidth();
    const ph = getPlayerHeight();

    for (let i = 0; i < platformEls.length; i++) {
        const platform = platformEls[i];
        const px = Number(platform.style.left.replace("px", ""));
        const py = Number(platform.style.top.replace("px", ""));
        const pWidth = Number(platform.dataset.hitboxWidth);
        const pHeight = Number(platform.dataset.hitboxHeight);

        if (isColliding(playerX, playerY, pw, ph, px, py, pWidth, pHeight)) {
            if (playerVelY > 0 && playerY + ph - playerVelY <= py + 5) {
                playerY = py - ph;
                playerVelY = 0;
                isOnGround = true;
            }
        }
    }

    if (!invincible) {
        for (let i = 0; i < enemyEls.length && !hitHazard; i++) {
            const enemy = enemyEls[i];
            const ex = Number(enemy.style.left.replace("px", ""));
            const ey = Number(enemy.style.top.replace("px", ""));
            const ew = Number(enemy.dataset.hitboxWidth);
            const eh = Number(enemy.dataset.hitboxHeight);

            if (isColliding(playerX, playerY, pw, ph, ex, ey, ew, eh)) {
                hitHazard = true;
            }
        }

        for (let i = 0; i < spikeEls.length && !hitHazard; i++) {
            const spike = spikeEls[i];
            const sx = Number(spike.style.left.replace("px", ""));
            const sy = Number(spike.style.top.replace("px", ""));
            const sw = Number(spike.dataset.hitboxWidth);
            const sh = Number(spike.dataset.hitboxHeight);

            if (isColliding(playerX, playerY, pw, ph, sx, sy, sw, sh)) {
                hitHazard = true;
            }
        }
    }

    if (goalEl) {
        const gx = Number(goalEl.style.left.replace("px", ""));
        const gy = Number(goalEl.style.top.replace("px", ""));
        const gw = Number(goalEl.dataset.hitboxWidth);
        const gh = Number(goalEl.dataset.hitboxHeight);
        hitGoal = isColliding(playerX, playerY, pw, ph, gx, gy, gw, gh);
    }

    return { isOnGround, hitHazard, hitGoal };
}

function playerDeath() {
    if (invincible) return;

    lives -= 1;
    if (lives < 0) {
        lives = 0;
    }
    uiLives.textContent = String(lives);

    if (lives <= 0) {
        gameActive = false;
        showGameOver("Game Over!", "You ran out of lives!");
    } else {
        loadLevel(currentLevel);
    }
}

function levelComplete() {
    if (currentLevel < maxLevels) {
        currentLevel += 1;
        loadLevel(currentLevel);
        player.classList.add("fade-in");
        setTimeout(() => player.classList.remove("fade-in"), 500);
    } else {
        gameActive = false;
        showGameOver("You Won!", "Congratulations! You completed all levels!");
    }
}

function updatePlayerAnimation(isOnGround) {
    const movingLeft = playerVelX < 0;
    const movingRight = playerVelX > 0;
    const jumping = playerVelY < 0;
    const falling = playerVelY > 0 && !isOnGround;

    if (jumping || falling) {
        player.style.backgroundImage = 'url("assets/player_jump.gif")';
    } else if (movingLeft) {
        player.style.backgroundImage = 'url("assets/player_left.gif")';
    } else if (movingRight) {
        player.style.backgroundImage = 'url("assets/player_right.gif")';
    } else {
        player.style.backgroundImage = 'url("assets/player_idle.gif")';
    }
}

function showGameOver(title, text) {
    document.getElementById("gameOverTitle").textContent = title;
    document.getElementById("gameOverText").textContent = text;
    gameOverDiv.style.display = "block";
    setPaused(false);
}

function hideGameOver() {
    gameOverDiv.style.display = "none";
}

function setPaused(nextPaused) {
    paused = Boolean(nextPaused);
    if (!gameStarted || !gameActive) {
        paused = false;
    }
    pauseOverlay.style.display = paused ? "flex" : "none";
}

function toggleSettingsPanel(forceOpen) {
    const currentlyOpen = settingsPanel.style.display === "flex";
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !currentlyOpen;
    settingsPanel.style.display = shouldOpen ? "flex" : "none";
}

function updateSettingsText() {
    document.getElementById("musicValue").textContent = `${Math.round(musicVolume * 100)}%`;
    document.getElementById("sfxValue").textContent = `${Math.round(sfxVolume * 100)}%`;
}

function canUseJumpThisFrame() {
    return coyoteTimer > 0 && jumpBufferTimer > 0;
}

function readAndAppendCustomLevels(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            const maybeList = Array.isArray(parsed) ? parsed : [parsed];

            if (!window.LevelSchema) {
                throw new Error("Level schema utilities are not loaded.");
            }

            const normalized = [];
            for (let i = 0; i < maybeList.length; i++) {
                const validation = window.LevelSchema.validateLevel(maybeList[i]);
                if (!validation.valid) {
                    throw new Error(`Custom level ${i + 1} is invalid: ${validation.errors.join("; ")}`);
                }
                normalized.push(window.LevelSchema.normalizeLevel(maybeList[i]));
            }

            normalized.forEach((lvl) => levels.push(lvl));
            loadedCustomLevelCount = normalized.length;
            syncMaxLevelUI();
            alert(`Loaded ${normalized.length} custom level(s). Use the Custom Levels button to play them.`);
        } catch (error) {
            alert(`Invalid custom level file: ${error.message}`);
        }
    };
    reader.readAsText(file);
}

function startNewRun(startLevel) {
    hideGameOver();
    gameStarted = true;
    gameActive = true;
    setPaused(false);
    toggleSettingsPanel(false);
    mainMenu.style.display = "none";
    lives = 3;
    uiLives.textContent = String(lives);
    loadLevel(startLevel);
}

function bindTouchControls() {
    document.querySelectorAll("[data-touch-key]").forEach((button) => {
        const key = button.getAttribute("data-touch-key");
        if (!key) return;

        const down = (event) => {
            event.preventDefault();
            setTouchKey(key, true);
        };

        const up = (event) => {
            event.preventDefault();
            setTouchKey(key, false);
        };

        button.addEventListener("pointerdown", down);
        button.addEventListener("pointerup", up);
        button.addEventListener("pointercancel", up);
        button.addEventListener("pointerleave", up);
    });
}

function bindUI() {
    document.getElementById("skipLevelBtn").addEventListener("click", () => {
        if (currentLevel < maxLevels) {
            loadLevel(currentLevel + 1);
        }
    });

    document.getElementById("addLifeBtn").addEventListener("click", () => {
        lives += 1;
        uiLives.textContent = String(lives);
    });

    document.getElementById("toggleInvincibleBtn").addEventListener("click", () => {
        invincible = !invincible;
        player.style.outline = invincible ? "2px solid #4CD1FF" : "none";
    });

    document.getElementById("startGameBtn").addEventListener("click", () => {
        startNewRun(1);
    });

    document.getElementById("customLevelBtn").addEventListener("click", () => {
        if (!levelUploadInput.files || levelUploadInput.files.length === 0) {
            alert("Choose a .json file first.");
            return;
        }

        if (loadedCustomLevelCount === 0) {
            readAndAppendCustomLevels(levelUploadInput.files[0]);
            return;
        }

        const customStart = maxLevels - loadedCustomLevelCount + 1;
        startNewRun(customStart);
    });

    levelUploadInput.addEventListener("change", () => {
        loadedCustomLevelCount = 0;
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
        startNewRun(1);
    });

    document.getElementById("pauseRestartBtn").addEventListener("click", () => {
        startNewRun(1);
    });

    document.getElementById("pauseBtn").addEventListener("click", () => {
        if (gameStarted && gameActive) {
            setPaused(!paused);
        }
    });

    document.getElementById("resumeBtn").addEventListener("click", () => {
        setPaused(false);
    });

    document.getElementById("settingsBtn").addEventListener("click", () => {
        toggleSettingsPanel();
    });

    document.getElementById("closeSettingsBtn").addEventListener("click", () => {
        toggleSettingsPanel(false);
    });

    document.getElementById("musicSlider").addEventListener("input", (event) => {
        musicVolume = Number(event.target.value) / 100;
        updateSettingsText();
    });

    document.getElementById("sfxSlider").addEventListener("input", (event) => {
        sfxVolume = Number(event.target.value) / 100;
        updateSettingsText();
    });

    bindTouchControls();
    updateSettingsText();
}

window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
    if (event.key === " ") {
        event.preventDefault();
    }

    if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        if (gameStarted && gameActive) {
            setPaused(!paused);
        }
    }

    if (event.key === konamiCode[konamiIndex]) {
        konamiIndex += 1;
        if (konamiIndex === konamiCode.length) {
            devMenu.style.display = "block";
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

window.addEventListener("resize", fitGameToViewport);

function update() {
    if (!gameActive || !gameStarted || paused) {
        return;
    }

    playerVelX = 0;
    if (isLeftPressed()) playerVelX = -MOVE_SPEED;
    if (isRightPressed()) playerVelX = MOVE_SPEED;

    playerX += playerVelX;
    if (playerX < 0) playerX = 0;
    const playerWidth = getPlayerWidth();
    if (playerX + playerWidth > WORLD_WIDTH) {
        playerX = WORLD_WIDTH - playerWidth;
    }

    const jumpHeld = isJumpPressed();
    if (jumpHeld) {
        jumpBufferTimer = JUMP_BUFFER_FRAMES;
    } else {
        jumpBufferTimer = Math.max(0, jumpBufferTimer - 1);
    }

    if (wasJumpHeld && !jumpHeld && playerVelY < 0) {
        playerVelY *= JUMP_CUTOFF_MULTIPLIER;
    }
    wasJumpHeld = jumpHeld;

    playerVelY += GRAVITY;
    playerY += playerVelY;

    if (playerY + getPlayerHeight() > WORLD_HEIGHT) {
        playerDeath();
        return;
    }

    const collision = checkCollisions();

    if (collision.isOnGround) {
        coyoteTimer = COYOTE_FRAMES;
    } else {
        coyoteTimer = Math.max(0, coyoteTimer - 1);
    }

    if (canUseJumpThisFrame()) {
        playerVelY = JUMP_STRENGTH;
        coyoteTimer = 0;
        jumpBufferTimer = 0;
    }

    if (collision.hitHazard) {
        playerDeath();
        return;
    }

    if (collision.hitGoal) {
        levelComplete();
        return;
    }

    updateEnemies();
    updatePlayerPosition();
    updatePlayerAnimation(collision.isOnGround);
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

normalizeRuntimeLevels();
syncMaxLevelUI();
bindUI();
fitGameToViewport();
gameLoop();