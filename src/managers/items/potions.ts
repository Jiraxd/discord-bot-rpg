import { Item, ItemType, RARITY } from "../item.manager";

export const potions: Item[] = [
  {
    itemId: "potion_1",
    state: [0, 0],
    name: "Health Potion",
    description: "Restores 20 health.",
    type: ItemType.POTION,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 20,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 10,
  },
  {
    itemId: "potion_2",
    state: [0, 0],
    name: "Mana Potion",
    description: "Restores 20 mana.",
    type: ItemType.POTION,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 0,
    mana: 20,
    rarity: RARITY.COMMON,
    npcSellPrice: 10,
  },
];
