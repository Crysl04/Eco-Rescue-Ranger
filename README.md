# 🌍 Eco Rescue Ranger  
### 3D Environmental Awareness Game (Final Project)

---

## 📌 Project Overview
**Eco Rescue Ranger** is a first-person 3D environmental simulation game developed as a final project for 3D Game Development. The player takes the role of an **Eco Rescue Ranger**, whose mission is to restore polluted environments by cleaning trash, planting trees, and reducing carbon pollution across multiple levels.

The game focuses on teaching **environmental responsibility**, **cause-and-effect relationships**, and the **impact of small actions** on ecosystem recovery through interactive gameplay.

---

## 🎯 Project Objectives
- Promote environmental awareness through gameplay
- Demonstrate waste management and reforestation concepts
- Show cause-and-effect between player actions and environmental change
- Apply 3D game development concepts using web technologies
- Implement functional UI, audio feedback, and level progression

---

## 🛠️ Technologies Used
- **HTML5 / CSS3**
- **JavaScript (ES Modules)**
- **Three.js** – 3D rendering, lighting, models, interactions
- **A-Frame** – terrain and environment structuring
- **Vite** – development server and bundler
- **Web Audio API / HTML Audio**
- **Pointer Lock API** – first-person camera control

---

## 🎮 Game Controls

| Action | Control |
|------|--------|
| Move | `W`, `A`, `S`, `D` |
| Look Around | Mouse |
| Jump | `SPACE` |
| Pick Up Trash | Aim with crosshair + `Left Click` |
| Plant Tree | `T` (when allowed) |
| Interact (Citizen / Trash Can) | `E` |
| Unlock Mouse | `ESC` |

---

## 👁️ Player Perspective
- First-person camera view
- Center **crosshair** for object interaction
- Pointer lock for smooth mouse control
- Gravity and jump mechanics enabled
- Interaction distance limited using raycasting

---

## 🧩 Core Game Systems

### 1️⃣ Trash Collection System
- Trash spawns randomly around the map
- Player must aim with the crosshair and click to collect
- Pickup only works within a limited interaction distance
- Trash types (internally tracked):
  - Plastic Bottle
  - Can
  - Food Wrapper
- Trash respawns more slowly as the environment improves

---

### 2️⃣ Inventory System
- Inventory displays **total trash count only**
- Trash is stored until disposed in a trash can
- Interacting with a trash can:
  - Clears inventory
  - Converts trash into eco progress
  - Reduces carbon pollution

---

### 3️⃣ Tree Planting System
- Available only in specific levels
- ❌ Disabled in the Coastal Cleanup level
- Trees are planted exactly where the player is aiming
- Trees appear instantly (no growth animation)
- Planting trees:
  - Costs Eco Points
  - Reduces Carbon Pollution
- Trees persist in the environment

---

### 4️⃣ Carbon Pollution System
- Carbon meter displayed on the HUD
- Shown as **whole-number percentage**
- Carbon decreases when:
  - Trash is collected
  - Trash is disposed
  - Trees are planted
- Carbon does **not increase over time**
- When carbon reaches **0% → Level Completed**

---

### 5️⃣ Environment Transformation System
The environment visually changes based on pollution level:

**Stage 1 – Polluted**
- Grey sky
- Dark ground
- Dead trees
- No wildlife

**Stage 2 – Improving**
- Brighter sky
- Grass begins to appear
- Reduced trash spawns
- Birds appear

**Stage 3 – Recovered**
- Blue sky
- Clean ground
- Flowing water
- Butterflies, birds, and fish
- Fully restored environment

---

## 🗺️ Level Design

### Level 1 – Polluted Park
- Mostly flat terrain
- Heavy trash presence
- Few trees
- Citizen NPC provides instructions

### Level 2 – Polluted Riverbank
- River with dirty water
- Floating trash
- Interactable objects placed on land only
- Fish appear after cleanup

### Level 3 – Coastal Cleanup
- Sand and water terrain
- Plastic waste and fishing nets
- ❌ Tree planting disabled
- Trash collection provides higher carbon reduction

### Level 4 – Deforested Forest Edge
- Uneven terrain with slopes
- Tree planting is the main objective
- Wildlife returns after reforestation

Each level increases in difficulty with higher pollution and more trash.

---

## 🧍 Citizen NPC System
- Appears in selected levels
- Modeled as a simple human figure
- Interact using `E`
- Provides:
  - Instructions
  - Environmental information
  - Level objectives

---

## 🎧 Audio System
Audio feedback is implemented for:
- Trash pickup
- Tree planting
- Level completion

Audio is unlocked after the first user interaction to comply with browser autoplay policies.

---

## 🖥️ User Interface (HUD)
The HUD displays:
- Current Level Name
- Carbon Percentage Bar
- Trash and Tree Goals
- Remaining Trash Count
- Inventory Count
- Eco Points
- Gameplay hints

The HUD appears automatically when gameplay starts.

---

## 🚀 How to Run the Game

### Requirements
- Node.js (v16 or higher recommended)

### Steps
```bash
npm install
npm run dev
