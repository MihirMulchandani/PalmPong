<div align="center">
  <h1>PalmPong</h1>
  <img width="1919" height="956" alt="Screenshot from 2026-01-12 00-40-47" src="https://github.com/user-attachments/assets/1d637848-85e2-4b09-820e-755ad533e50e" />

</div>


PalmPong is a gesture-controlled Pong game built around a single idea:

**input does not need to be physical to be precise.**

The paddle is controlled entirely by the vertical movement of a user’s palm via a webcam.  
No keyboard. No mouse. No touch.

All processing happens in the browser.  
Nothing leaves the client.

---

## What it explores

PalmPong is not about reinventing Pong.  
It is about exploring **camera-based input as a first-class control surface**.

The constraints are intentional:

- One hand only  
- Vertical movement only  
- No buttons during gameplay  
- No backend  
- No persistence  

If the hand disappears, the game pauses.  
If the ball is missed, the game ends.

---

## How it works (high level)

- Webcam feed is accessed directly in the browser  
- MediaPipe Hands extracts hand landmarks in real time  
- A palm center is computed from stable landmarks  
- The palm’s Y position is mapped to paddle movement  
- Smoothing is applied to reduce jitter  
- The game loop runs on `requestAnimationFrame`  

The result is a control system that feels continuous rather than discrete.

---

## Design principles

- The browser is the runtime  
- The camera is the controller  
- Absence of input is a valid state  
- Visuals should never compete with interaction  
- Simplicity > novelty  

If the paddle feels unpredictable, the mapping is wrong.

---

## Tech stack

- HTML5 Canvas  
- Vanilla JavaScript  
- MediaPipe Hands (JavaScript)  
- CSS  
- No frameworks  
- No backend  
- No build step  

---

## Notes

The visual design is intentionally black and white.  
The goal is clarity, not decoration.

The interesting part of this project is not the game logic,  
but the translation of noisy, real-world input into something playable.

---

<p align="center">
  <a href="https://palm-pong.vercel.app">
    <img width="232" height="56" alt="Screenshot from 2026-01-12 00-41-21" src="https://github.com/user-attachments/assets/defb5d48-d3f5-4b88-947c-e7d14dd1df13" />

  </a>
</p>


© MihirMulchandani
