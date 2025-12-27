
export const LAYOUTS = {
  park: {
    spawn: [0, 1.6, 12],
    bin: [6, 0.1, 6],
    sapling: [-6, 0.1, 6],
    npc: [-10, 0.1, 0],
    buildingZones: [[-40,-20, -40,-20], [20,40, 20,40]]
  },
  river: {
    spawn: [0, 1.6, 18],
    // River water plane spans roughly z ∈ [-75, 15]; keep interactables on land (z > 20)
    bin: [32, 0.1, 52],
    sapling: [44, 0.1, 58],
    npc: [20, 0.1, 46],
    buildingZones: [[30,55, -10,10]]
  },
  coast: {
    spawn: [0, 1.6, 22],
    bin: [14, 0.1, 12],
    sapling: [-14, 0.1, 12],
    npc: [-18, 0.1, 4],
    buildingZones: [[35,60, 25,55]]
  },
  forest: {
    spawn: [0, 1.6, 14],
    bin: [8, 0.1, 10],
    sapling: [-8, 0.1, 10],
    npc: [-14, 0.1, 0],
    buildingZones: [[-55,-35, 30,55]]
  },
  rooftop: {
    spawn: [0, 1.6, 10],
    bin: [6, 0.1, 6],
    sapling: [-6, 0.1, 6],
    npc: [-10, 0.1, 0],
    buildingZones: [[-50,50, -50,50]]
  }
};
