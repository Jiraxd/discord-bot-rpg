import { Item, ItemType, RARITY } from "../item.manager";

export const food: Item[] = [
  {
    itemId: "food_1",
    state: [0, 0],
    name: "Apple",
    description: "A fresh apple.",
    type: ItemType.FOOD,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 10,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 5,
  },
  {
    itemId: "food_2",
    state: [0, 0],
    name: "Bread",
    description: "A loaf of bread.",
    type: ItemType.FOOD,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 20,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 10,
  },
];
