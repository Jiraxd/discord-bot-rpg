import { Item, ItemType, RARITY } from "../item.manager";

export const keys: Item[] = [
  {
    itemId: "key_1",
    state: [0, 0],
    name: "Rusty Key",
    description:
      "A rusty key that looks like it hasn't been used in a long time.",
    type: ItemType.KEY,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 5,
  },
  {
    itemId: "key_2",
    state: [0, 0],
    name: "Golden Key",
    description: "A shiny golden key that looks valuable.",
    type: ItemType.KEY,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.RARE,
    npcSellPrice: 20,
  },
];
