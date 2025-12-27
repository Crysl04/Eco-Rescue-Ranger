
export const TRASH_TYPES = [
  { id: 'bottle', label: 'Plastic Bottle', points: 5, color: 0x6fb6ff, shape: 'bottle' },
  { id: 'can',    label: 'Can',           points: 3, color: 0xc0c0c0, shape: 'can' },
  { id: 'wrapper',label: 'Food Wrapper',  points: 2, color: 0xffd36f, shape: 'wrapper' }
];

export function randomTrashType() {
  return TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
}
