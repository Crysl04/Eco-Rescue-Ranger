
export const LEVEL_ORDER = ['park', 'river', 'coast', 'forest'];

export const LEVELS = {
  park: {
    id: 'park',
    name: 'Polluted Park',
    startCarbon: 95,
    trashCount: 55,
    buildingCount: 14,
    river: false,
    treeCost: 12,
    goals: { trashCleaned: 25, treesPlanted: 3 },
    terrain: { ground: 0x3f5a3c, accent: 0x2f7a2f }
  },
  river: {
    id: 'river',
    name: 'Polluted Riverbank',
    startCarbon: 100,
    trashCount: 70,
    buildingCount: 10,
    river: true,
    treeCost: 14,
    goals: { trashCleaned: 35, treesPlanted: 3 },
    terrain: { ground: 0x3b4a3a, accent: 0x6b5b3b }
  },
  coast: {
    id: 'coast',
    name: 'Coastal Cleanup',
    startCarbon: 105,
    trashCount: 80,
    buildingCount: 8,
    river: true,
    treeCost: 999,
    goals: { trashCleaned: 40, treesPlanted: 0 },
    terrain: { ground: 0xc2b280, accent: 0x9c8b5a }
  },
  forest: {
    id: 'forest',
    name: 'Deforested Forest Edge',
    startCarbon: 98,
    trashCount: 45,
    buildingCount: 5,
    river: false,
    treeCost: 10,
    goals: { trashCleaned: 15, treesPlanted: 7 },
    terrain: { ground: 0x2f3f2f, accent: 0x1f5a1f }
  }
};

export function getLevelConfig(id) { return LEVELS[id]; }
