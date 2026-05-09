#!/usr/bin/env python3
"""Dynamic movement solver for FlatPorm levels."""

from __future__ import annotations

import argparse
import heapq
import json
import math
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

WORLD_WIDTH = 800.0
WORLD_HEIGHT = 600.0

PLAYER_W = 30.0
PLAYER_H = 24.0
ENEMY_W = 34.0
ENEMY_H = 30.0
SPIKE_W = 40.0
SPIKE_H = 37.0
GOAL_W = 42.0
GOAL_H = 41.0

GRAVITY = 0.6
JUMP_STRENGTH = -12.0
MOVE_SPEED = 5.0
JUMP_CUTOFF_MULTIPLIER = 0.45
COYOTE_FRAMES = 8
JUMP_BUFFER_FRAMES = 8
WIN_SCORE = 1_000_000.0
DEAD_SCORE = -1_000_000.0
BELOW_GOAL_PENALTY_MULTIPLIER = 2.5
REVISIT_PENALTY_MULTIPLIER = 6.0
BEAM_SEARCH_DECAY = 0.92
FALLBACK_MOVE_THRESHOLD = 4.0
FALLBACK_GOAL_ABOVE_PADDING = 20.0
ASTAR_HEURISTIC_SCALE = 7.0
DISTANCE_IMPROVEMENT_THRESHOLD = 2.0
STALL_FRAMES_THRESHOLD = 120


@dataclass(frozen=True)
class Action:
    left: bool
    right: bool
    jump: bool
    token: str


ACTIONS: Tuple[Action, ...] = (
    Action(False, False, False, "."),
    Action(True, False, False, "L"),
    Action(False, True, False, "R"),
    Action(False, False, True, "J"),
    Action(True, False, True, "LJ"),
    Action(False, True, True, "RJ"),
)
ACTION_IDLE = ACTIONS[0]
ACTION_LEFT = ACTIONS[1]
ACTION_RIGHT = ACTIONS[2]
ACTION_JUMP = ACTIONS[3]
ACTION_LEFT_JUMP = ACTIONS[4]
ACTION_RIGHT_JUMP = ACTIONS[5]


@dataclass
class Level:
    platforms: List[Dict[str, float]]
    enemies: List[Dict[str, float]]
    spikes: List[Dict[str, float]]
    goalX: float
    goalY: float
    goalW: float
    goalH: float


@dataclass
class State:
    x: float
    y: float
    vx: float
    vy: float
    coyote: int
    jump_buffer: int
    was_jump_held: bool
    frame: int
    dead: bool = False
    won: bool = False


def is_colliding(x: float, y: float, w: float, h: float, px: float, py: float, pw: float, ph: float) -> bool:
    return x < px + pw and x + w > px and y < py + ph and y + h > py


def ease_in_out_sine(progress: float) -> float:
    return -(math.cos(math.pi * progress) - 1.0) / 2.0


def enemy_position(enemy: Dict[str, float], frame: int) -> Tuple[float, float]:
    enemy_type = enemy.get("type", "walker")
    if enemy_type == "floater":
        start_y = float(enemy.get("minY", enemy["y"] - 60.0))
        end_y = float(enemy.get("maxY", enemy["y"] + 60.0))
        cycle_time = 120.0
        progress = (frame % int(cycle_time)) / (cycle_time / 2.0)
        eased = ease_in_out_sine(progress if progress <= 1.0 else 2.0 - progress)
        return float(enemy["x"]), start_y + (end_y - start_y) * eased

    start_x = float(enemy.get("minX", enemy["x"] - 50.0))
    end_x = float(enemy.get("maxX", enemy["x"] + 50.0))
    cycle_time = 100.0
    progress = (frame % int(cycle_time)) / (cycle_time / 2.0)
    eased = ease_in_out_sine(progress if progress <= 1.0 else 2.0 - progress)
    return start_x + (end_x - start_x) * eased, float(enemy["y"])


def find_spike_anchor_y(spike_x: float, platforms: Sequence[Dict[str, float]]) -> float | None:
    anchor_y = None
    for platform in platforms:
        px = float(platform["x"])
        py = float(platform["y"])
        pw = float(platform["w"])
        if spike_x + SPIKE_W > px and spike_x < px + pw:
            if anchor_y is None or py < anchor_y:
                anchor_y = py
    return anchor_y


def hazard_rects(level: Level, frame: int) -> List[Tuple[float, float, float, float]]:
    rects: List[Tuple[float, float, float, float]] = []
    for spike in level.spikes:
        sx = float(spike["x"])
        anchor_y = find_spike_anchor_y(sx, level.platforms)
        sy = (anchor_y - SPIKE_H) if anchor_y is not None else float(spike["y"])
        sw = float(spike.get("hitboxW", SPIKE_W))
        sh = float(spike.get("hitboxH", SPIKE_H))
        rects.append((sx, sy, sw, sh))
    for enemy in level.enemies:
        ex, ey = enemy_position(enemy, frame)
        ew = float(enemy.get("hitboxW", ENEMY_W))
        eh = float(enemy.get("hitboxH", ENEMY_H))
        rects.append((ex, ey, ew, eh))
    return rects


def goal_hit(state: State, level: Level) -> bool:
    return is_colliding(state.x, state.y, PLAYER_W, PLAYER_H, level.goalX, level.goalY, level.goalW, level.goalH)


def on_hazard(state: State, level: Level, frame: int) -> bool:
    for hx, hy, hw, hh in hazard_rects(level, frame):
        if is_colliding(state.x, state.y, PLAYER_W, PLAYER_H, hx, hy, hw, hh):
            return True
    return False


def grounded_at(state: State, level: Level) -> bool:
    for platform in level.platforms:
        px = float(platform["x"])
        py = float(platform["y"])
        pw = float(platform["w"])
        ph = float(platform["h"])
        if is_colliding(state.x, state.y, PLAYER_W, PLAYER_H, px, py, pw, ph):
            if state.vy >= 0 and state.y + PLAYER_H <= py + 5:
                return True
    return False


def simulate_step(state: State, action: Action, level: Level) -> State:
    if state.dead or state.won:
        return state

    x = state.x
    y = state.y
    vx = 0.0
    vy = state.vy
    coyote = state.coyote
    jump_buffer = state.jump_buffer
    was_jump_held = state.was_jump_held
    frame = state.frame + 1

    if action.left:
        vx = -MOVE_SPEED
    if action.right:
        vx = MOVE_SPEED

    x += vx
    if x < 0.0:
        x = 0.0
    if x + PLAYER_W > WORLD_WIDTH:
        x = WORLD_WIDTH - PLAYER_W

    jump_held = action.jump
    if jump_held:
        jump_buffer = JUMP_BUFFER_FRAMES
    else:
        jump_buffer = max(0, jump_buffer - 1)

    if was_jump_held and (not jump_held) and vy < 0.0:
        vy *= JUMP_CUTOFF_MULTIPLIER
    was_jump_held = jump_held

    previous_y = y
    vy += GRAVITY
    y += vy

    if y + PLAYER_H > WORLD_HEIGHT:
        return State(x, y, vx, vy, coyote, jump_buffer, was_jump_held, frame, dead=True, won=False)

    is_on_ground = False
    for platform in level.platforms:
        px = float(platform["x"])
        py = float(platform["y"])
        pw = float(platform["w"])
        ph = float(platform["h"])
        if is_colliding(x, y, PLAYER_W, PLAYER_H, px, py, pw, ph):
            if vy > 0 and previous_y + PLAYER_H <= py + 5:
                y = py - PLAYER_H
                vy = 0.0
                is_on_ground = True

    if is_on_ground:
        coyote = COYOTE_FRAMES
    else:
        coyote = max(0, coyote - 1)

    if coyote > 0 and jump_buffer > 0:
        vy = JUMP_STRENGTH
        coyote = 0
        jump_buffer = 0

    next_state = State(x, y, vx, vy, coyote, jump_buffer, was_jump_held, frame, dead=False, won=False)

    if on_hazard(next_state, level, frame):
        next_state.dead = True
        return next_state

    if goal_hit(next_state, level):
        next_state.won = True
    return next_state


def score_state(state: State, level: Level, visited: Dict[Tuple[int, int], int]) -> float:
    if state.won:
        return WIN_SCORE
    if state.dead:
        return DEAD_SCORE

    goal_cx = level.goalX + level.goalW / 2.0
    goal_cy = level.goalY + level.goalH / 2.0
    player_cx = state.x + PLAYER_W / 2.0
    player_cy = state.y + PLAYER_H / 2.0
    dx = abs(goal_cx - player_cx)
    dy = abs(goal_cy - player_cy)
    below_goal_penalty = max(0.0, player_cy - goal_cy) * BELOW_GOAL_PENALTY_MULTIPLIER
    dist = dx + dy + below_goal_penalty
    key = (int(state.x // 20), int(state.y // 20))
    revisit_penalty = visited.get(key, 0) * REVISIT_PENALTY_MULTIPLIER
    return -dist - revisit_penalty - abs(state.vy) * 0.25


def choose_action(state: State, level: Level, visited: Dict[Tuple[int, int], int], horizon: int, beam_width: int) -> Action:
    beam: List[Tuple[float, State, Action | None]] = [(0.0, state, None)]
    decay = BEAM_SEARCH_DECAY

    for depth in range(horizon):
        next_beam: List[Tuple[float, State, Action | None]] = []
        for total_score, current_state, first_action in beam:
            for action in ACTIONS:
                next_state = simulate_step(current_state, action, level)
                lead_action = action if first_action is None else first_action
                step_score = score_state(next_state, level, visited) * (decay**depth)
                next_beam.append((total_score + step_score, next_state, lead_action))

        next_beam.sort(key=lambda item: item[0], reverse=True)
        beam = next_beam[:beam_width]
        if not beam:
            return ACTION_IDLE
        if beam[0][1].won:
            break

    return beam[0][2] if beam[0][2] is not None else ACTION_IDLE


def distance_to_goal(state: State, level: Level) -> float:
    goal_cx = level.goalX + level.goalW / 2.0
    goal_cy = level.goalY + level.goalH / 2.0
    player_cx = state.x + PLAYER_W / 2.0
    player_cy = state.y + PLAYER_H / 2.0
    dx = abs(goal_cx - player_cx)
    dy = abs(goal_cy - player_cy)
    below_goal_penalty = max(0.0, player_cy - goal_cy) * BELOW_GOAL_PENALTY_MULTIPLIER
    return dx + dy + below_goal_penalty


def fallback_action(state: State, level: Level) -> Action:
    goal_cx = level.goalX + level.goalW / 2.0
    player_cx = state.x + PLAYER_W / 2.0
    move_right = goal_cx > player_cx + FALLBACK_MOVE_THRESHOLD
    move_left = goal_cx < player_cx - FALLBACK_MOVE_THRESHOLD
    goal_above = state.y > level.goalY - FALLBACK_GOAL_ABOVE_PADDING
    can_jump = state.coyote > 0
    jump = can_jump and goal_above

    if move_left and jump:
        return ACTION_LEFT_JUMP
    if move_right and jump:
        return ACTION_RIGHT_JUMP
    if move_left:
        return ACTION_LEFT
    if move_right:
        return ACTION_RIGHT
    if jump:
        return ACTION_JUMP
    return ACTION_IDLE


def state_key(state: State) -> Tuple[int, int, int, int, int, int, int]:
    return (
        int(state.x // 4),
        int(state.y // 4),
        int(state.vy // 1),
        min(state.coyote, 2),
        min(state.jump_buffer, 2),
        1 if state.was_jump_held else 0,
        state.frame % 200,
    )


def astar_next_action(start: State, level: Level, max_expansions: int = 6000) -> Action | None:
    if start.won or start.dead:
        return None

    counter = 0
    start_h = distance_to_goal(start, level)
    heap: List[Tuple[float, float, int, State, Action | None]] = [(start_h, 0.0, counter, start, None)]
    best_cost: Dict[Tuple[int, int, int, int, int, int, int], float] = {state_key(start): 0.0}
    expansions = 0

    while heap and expansions < max_expansions:
        _, g_cost, _, state, first_action = heapq.heappop(heap)
        expansions += 1

        if state.won:
            return first_action

        for action in ACTIONS:
            next_state = simulate_step(state, action, level)
            if next_state.dead:
                continue

            lead_action = action if first_action is None else first_action
            next_g = g_cost + 1.0
            key = state_key(next_state)
            if key in best_cost and best_cost[key] <= next_g:
                continue
            best_cost[key] = next_g
            counter += 1
            h = distance_to_goal(next_state, level) / ASTAR_HEURISTIC_SCALE
            heapq.heappush(heap, (next_g + h, next_g, counter, next_state, lead_action))

    return None


def normalize_level(raw: Dict[str, object]) -> Level:
    platforms = list(raw.get("platforms", []))
    enemies = list(raw.get("enemies", []))
    spikes = list(raw.get("spikes", []))
    return Level(
        platforms=platforms,
        enemies=enemies,
        spikes=spikes,
        goalX=float(raw.get("goalX", 700)),
        goalY=float(raw.get("goalY", 350)),
        goalW=float(raw.get("goalW", GOAL_W)),
        goalH=float(raw.get("goalH", GOAL_H)),
    )


def js_object_array_to_json(source: str) -> str:
    source = re.sub(r"//.*", "", source)
    source = re.sub(r"/\*.*?\*/", "", source, flags=re.S)
    source = re.sub(r",\s*([}\]])", r"\1", source)
    source = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', source)
    source = source.replace("'", '"')
    return source


def load_levels_from_js(levels_path: Path) -> List[Level]:
    content = levels_path.read_text(encoding="utf-8")
    match = re.search(r"const\s+levels\s*=\s*(\[[\s\S]*?\]);", content)
    if not match:
        raise ValueError("Could not find `const levels = [...]` in levels.js")

    raw_json = js_object_array_to_json(match.group(1))
    parsed = json.loads(raw_json)
    if not isinstance(parsed, list):
        raise ValueError("Parsed levels data is not a list")
    return [normalize_level(level) for level in parsed]


def solve_level(level: Level, start_x: float, start_y: float, max_frames: int, horizon: int, beam_width: int) -> Tuple[State, List[Action]]:
    state = State(start_x, start_y, 0.0, 0.0, 0, 0, False, 0)
    if grounded_at(state, level):
        state.coyote = COYOTE_FRAMES
    if goal_hit(state, level):
        state.won = True
        return state, []

    visited: Dict[Tuple[int, int], int] = {}
    history: List[Action] = []
    best_distance = distance_to_goal(state, level)
    stall_frames = 0

    for _ in range(max_frames):
        key = (int(state.x // 20), int(state.y // 20))
        visited[key] = visited.get(key, 0) + 1

        dist = distance_to_goal(state, level)
        if dist < best_distance - DISTANCE_IMPROVEMENT_THRESHOLD:
            best_distance = dist
            stall_frames = 0
        else:
            stall_frames += 1

        if stall_frames >= STALL_FRAMES_THRESHOLD:
            action = astar_next_action(state, level) or fallback_action(state, level)
        else:
            action = choose_action(state, level, visited, horizon=horizon, beam_width=beam_width)
        history.append(action)
        state = simulate_step(state, action, level)

        if state.won or state.dead:
            break

    return state, history


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Dynamic FlatPorm movement solver")
    parser.add_argument("--levels-file", default="levels.js", help="Path to levels.js")
    parser.add_argument("--level", type=int, required=True, help="1-based level index")
    parser.add_argument("--start-x", type=float, required=True, help="Starting X position")
    parser.add_argument("--start-y", type=float, required=True, help="Starting Y position")
    parser.add_argument("--max-frames", type=int, default=1400, help="Max simulation frames")
    parser.add_argument("--horizon", type=int, default=18, help="Lookahead depth")
    parser.add_argument("--beam-width", type=int, default=28, help="Beam width")
    parser.add_argument("--compact", action="store_true", help="Print tokens as a compact single line")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    levels = load_levels_from_js(Path(args.levels_file))
    if args.level < 1 or args.level > len(levels):
        print(f"Invalid level index: {args.level} (available: 1..{len(levels)})")
        return 2

    final_state, actions = solve_level(
        level=levels[args.level - 1],
        start_x=args.start_x,
        start_y=args.start_y,
        max_frames=args.max_frames,
        horizon=args.horizon,
        beam_width=args.beam_width,
    )

    if args.compact:
        print(" ".join(action.token for action in actions))
    else:
        for i, action in enumerate(actions):
            print(
                json.dumps(
                    {"frame": i, "left": action.left, "right": action.right, "jump": action.jump, "token": action.token}
                )
            )

    status = "WON" if final_state.won else ("DEAD" if final_state.dead else "INCOMPLETE")
    print(
        json.dumps(
            {
                "status": status,
                "frames_used": len(actions),
                "final_x": round(final_state.x, 2),
                "final_y": round(final_state.y, 2),
            }
        )
    )
    return 0 if final_state.won else 1


if __name__ == "__main__":
    raise SystemExit(main())
