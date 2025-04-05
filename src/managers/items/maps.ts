import { Item, ItemType, RARITY } from "../item.manager";

export const maps: Item[] = [
  {
    itemId: "map_1",
    state: [0, 0],
    name: "Treasure Map",
    description: "A map leading to hidden treasure.",
    type: ItemType.MAP,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.UNCOMMON,
    npcSellPrice: 50,
  },
  {
    itemId: "map_2",
    state: [0, 0],
    name: "Ancient Map",
    description: "An ancient map with mysterious markings.",
    type: ItemType.MAP,
    level: 5,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.RARE,
    npcSellPrice: 100,
  },
];
