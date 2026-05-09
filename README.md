# FLATPORMINGM GRAHHHHH (20 Levels)

this is a small browser platformer built entirely in **one HTML and JS file**.  
everything- the layout, styles, and game logic is bundled together so you can open it in a browser and play immediately. no build steps, no external scripts, no dependencies. just itself, and a browser.

it uses plain HTML, CSS, and JavaScript to create a simple but surprisingly fun 20‑level platformer with enemies, spikes, gravity, and a basic lives system.

to do!

- [x] finish and add sprite textures

- [x] finish and add animations

- [ ] add a theme (what did i even mean by this?? what)

- [ ] implement music (how do we do this???)

- [?] custom levels (it's currently a separate file and is not fully implemented within the main html)

- [ ] add the death animation + spraying particle effect upon death

- [ ] add textures to platforms, background, etc 😔

- [ ] add a how to play on the main menu 

- [x] i know willow won't want this but i want lore 

- [x] chrome extension packaging

- [?] mobile

---

## creature feature

- 20 handcrafted levels
- moving enemies with patrol ranges
- spikes and other hazards
- a goal orb to finish each level
- three‑life system with a game‑over screen
- smooth animation using `requestAnimationFrame`
- basic physics (gravity, jumping, horizontal movement)
- everything contained in a tiny `.html` and `js` file

---

## how to play !!!

- **left:** <ins>arrow left</ins> or <ins>a</ins>  
- **right:** <ins>arrow right</ins> or <ins>d</ins>  
- **jump:** <ins>arrow up</ins>, <ins>w</ins>, or <ins>space</ins>  
- reach the <ins>green goal orb</ins> to advance  
- avoid enemies (yellow) and spikes (red)
- you start with 3 lives  
- pause: <ins>p</ins> or <ins>escape</ins>
- on mobile/tablet: use on-screen touch controls

just open the file in any modern browser and you're FLATPORMING.

## python dynamic movement solver

there is now a separate python file: `dynamic_solver.py`.

it replans movement every frame (left/right/jump) and tries to beat a chosen level from any start position you provide.

example:

```bash
python3 dynamic_solver.py --level 1 --start-x 50 --start-y 450 --compact
```

use `--levels-file` if your `levels.js` is in a different location.
it exits with code `0` when the goal is reached, and `1` if the run fails or times out.

## warning D:
Make sure you have the JS and HTML in the same folder, otherwise it gets kinda clueless and loses 90% of the game
### advice
Use the 'Code' button dropdown to download the repo as a .zip then unzip and use the HTML from there instead of downloading everything manually. Makes everything SO MUCH EASIER

SO.... USING GITHUB???? -WILLOW

SHHH I ONLY JUST FIGURED IT OUT -EQUINOX

---

## how it works (NEEEERD SECTION) (i will not edit this so that it's in NERRRRRD launguarge)

### Physics

- Gravity is applied every frame  
- Vertical velocity handles falling and jumping  
- Horizontal movement is based on key input  

### Collision Detection

- Uses simple AABB (axis‑aligned bounding box) checks  
- Platforms stop downward movement  
- Enemies and spikes cause a death  
- Touching the goal completes the level  

### Level Format

Each level is defined inside the file like this:

```js
{
  platforms: [ {x, y, w, h}, ... ],
  enemies:   [ {x, y, minX, maxX}, ... ],
  spikes:    [ {x, y}, ... ],
  goalX: number,
  goalY: number
}
```
from what we remember at least..............................
the code is constantly updating so check back every now and then!! 

---

## custom level format

custom uploads now validate against a shared schema used by both the game and editor.

required fields:

```js
{
  platforms: [ { x, y, w, h }, ... ],
  enemies:   [ { x, y, minX, maxX }, ... ],
  spikes:    [ { x, y }, ... ],
  goalX: number,
  goalY: number
}
```

optional fields:

```js
{
  enemies: [ { hitboxW, hitboxH } ],
  spikes:  [ { hitboxW, hitboxH } ],
  goalW: number,
  goalH: number
}
```

you can upload either:

- one level object
- an array of level objects

---

## quick regression checklist

- [ ] touching spikes removes exactly 1 life
- [ ] touching enemies removes exactly 1 life
- [ ] reaching goal loads next level
- [ ] lives hitting 0 shows game over
- [ ] restart starts from level 1 with 3 lives
- [ ] pause/resume works from keyboard and ui button
- [ ] mobile touch controls move and jump correctly
- [ ] custom level upload rejects invalid json with an error

- i, equinox, did... like. nothing. i came up with the idea lmao
- i made the music and sprites which took like. max 1 hour
- and also edited this to make it seem friengldier
- willow did 90% of this!! look at her!! giver her the credit!!

- NO I FUCKING DIDNT SOB -WILLOW


## thank you for visiting this page and hopefully downloading maybe please 
