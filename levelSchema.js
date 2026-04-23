(function () {
    "use strict";

    function isFiniteNumber(value) {
        return typeof value === "number" && Number.isFinite(value);
    }

    function toNumber(value, fallback) {
        if (isFiniteNumber(value)) {
            return value;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function normalizePlatform(item) {
        return {
            x: toNumber(item && item.x, 0),
            y: toNumber(item && item.y, 0),
            w: Math.max(20, toNumber(item && item.w, 100)),
            h: Math.max(10, toNumber(item && item.h, 20))
        };
    }

    function normalizeEnemy(item) {
        const x = toNumber(item && item.x, 100);
        const y = toNumber(item && item.y, 100);
        const type = item && item.type === "floater" ? "floater" : "walker";

        if (type === "floater") {
            const minY = toNumber(item && item.minY, y - 60);
            const maxY = toNumber(item && item.maxY, y + 60);

            return {
                x,
                y,
                type: "floater",
                minY: Math.min(minY, maxY),
                maxY: Math.max(minY, maxY),
                hitboxW: toNumber(item && item.hitboxW, 34),
                hitboxH: toNumber(item && item.hitboxH, 30)
            };
        }

        const minX = toNumber(item && item.minX, x - 50);
        const maxX = toNumber(item && item.maxX, x + 50);

        return {
            x,
            y,
            type: "walker",
            minX: Math.min(minX, maxX),
            maxX: Math.max(minX, maxX),
            hitboxW: toNumber(item && item.hitboxW, 34),
            hitboxH: toNumber(item && item.hitboxH, 30)
        };
    }

    function normalizeSpike(item) {
        return {
            x: toNumber(item && item.x, 0),
            y: toNumber(item && item.y, 0),
            hitboxW: toNumber(item && item.hitboxW, 40),
            hitboxH: toNumber(item && item.hitboxH, 37)
        };
    }

    function normalizeShellshot(item) {
        const x = toNumber(item && item.x, 100);

        return {
            x,
            y: toNumber(item && item.y, 100),
            dir: toNumber(item && item.dir, 1),
            scamperMinX: toNumber(item && item.scamperMinX, x - 80),
            scamperMaxX: toNumber(item && item.scamperMaxX, x + 80),
            cooldown: toNumber(item && item.cooldown, 0),
            hitboxW: toNumber(item && item.hitboxW, 32),
            hitboxH: toNumber(item && item.hitboxH, 32)
        };
    }

    function normalizeLevel(level) {
        const src = level || {};

        const normalized = {
            platforms: Array.isArray(src.platforms) ? src.platforms.map(normalizePlatform) : [],
            enemies: Array.isArray(src.enemies) ? src.enemies.map(normalizeEnemy) : [],
            spikes: Array.isArray(src.spikes) ? src.spikes.map(normalizeSpike) : [],
            shellshots: Array.isArray(src.shellshots) ? src.shellshots.map(normalizeShellshot) : [],
            goalX: toNumber(src.goalX, 700),
            goalY: toNumber(src.goalY, 350),
            goalW: toNumber(src.goalW, 42),
            goalH: toNumber(src.goalH, 41)
        };

        if (src.shellers && Array.isArray(src.shellers)) {
            normalized.shellers = src.shellers;
        }

        return normalized;
    }

    function validateLevel(level) {
        const errors = [];

        if (!level || typeof level !== "object") {
            return {
                valid: false,
                errors: ["Level must be an object"]
            };
        }

        if (!Array.isArray(level.platforms) || level.platforms.length === 0) {
            errors.push("platforms must be a non-empty array");
        }

        if (!Array.isArray(level.enemies)) {
            errors.push("enemies must be an array");
        }

        if (!Array.isArray(level.spikes)) {
            errors.push("spikes must be an array");
        }

        if (level.shellshots != null && !Array.isArray(level.shellshots)) {
            errors.push("shellshots must be an array when present");
        }

        if (!isFiniteNumber(toNumber(level.goalX, NaN))) {
            errors.push("goalX must be a number");
        }

        if (!isFiniteNumber(toNumber(level.goalY, NaN))) {
            errors.push("goalY must be a number");
        }

        if (Array.isArray(level.platforms)) {
            level.platforms.forEach(function (platform, index) {
                if (!isFiniteNumber(toNumber(platform && platform.x, NaN))) {
                    errors.push("platform " + (index + 1) + " is missing numeric x");
                }
                if (!isFiniteNumber(toNumber(platform && platform.y, NaN))) {
                    errors.push("platform " + (index + 1) + " is missing numeric y");
                }
                if (!isFiniteNumber(toNumber(platform && platform.w, NaN))) {
                    errors.push("platform " + (index + 1) + " is missing numeric w");
                }
                if (!isFiniteNumber(toNumber(platform && platform.h, NaN))) {
                    errors.push("platform " + (index + 1) + " is missing numeric h");
                }
            });
        }

        if (Array.isArray(level.enemies)) {
            level.enemies.forEach(function (enemy, index) {
                const fields = enemy && enemy.type === "floater"
                    ? ["x", "y", "minY", "maxY"]
                    : ["x", "y", "minX", "maxX"];
                fields.forEach(function (field) {
                    if (!isFiniteNumber(toNumber(enemy && enemy[field], NaN))) {
                        errors.push("enemy " + (index + 1) + " is missing numeric " + field);
                    }
                });
            });
        }

        if (Array.isArray(level.spikes)) {
            level.spikes.forEach(function (spike, index) {
                const fields = ["x", "y"];
                fields.forEach(function (field) {
                    if (!isFiniteNumber(toNumber(spike && spike[field], NaN))) {
                        errors.push("spike " + (index + 1) + " is missing numeric " + field);
                    }
                });
            });
        }

        if (Array.isArray(level.shellshots)) {
            level.shellshots.forEach(function (shellshot, index) {
                const fields = ["x", "y"];
                fields.forEach(function (field) {
                    if (!isFiniteNumber(toNumber(shellshot && shellshot[field], NaN))) {
                        errors.push("shellshot " + (index + 1) + " is missing numeric " + field);
                    }
                });
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    window.LevelSchema = {
        normalizeLevel,
        validateLevel
    };
})();
