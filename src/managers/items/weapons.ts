import { Item, ItemType, RARITY } from "../item.manager";

export const weapons: Item[] = [
  {
    itemId: "weapon_1",
    state: [0, 0],
    name: "Wooden Sword",
    description: "A basic wooden sword.",
    type: ItemType.WEAPON,
    level: 1,
    attackMin: 5,
    attackMax: 10,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 10,
  },
  {
    itemId: "weapon_2",
    state: [0, 0],
    name: "Iron Sword",
    description: "A sturdy iron sword.",
    type: ItemType.WEAPON,
    level: 5,
    attackMin: 10,
    attackMax: 15,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.UNCOMMON,
    npcSellPrice: 20,
  },
];
