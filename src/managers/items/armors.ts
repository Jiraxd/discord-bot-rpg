import { Item, ItemType, RARITY } from "../item.manager";

export const armors: Item[] = [
  {
    itemId: "armor_1",
    state: [0, 0],
    name: "Leather Armor",
    description: "A basic leather armor.",
    type: ItemType.ARMOR,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 5,
    health: 0,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 10,
  },
  {
    itemId: "armor_2",
    state: [0, 0],
    name: "Chainmail Armor",
    description: "A sturdy chainmail armor.",
    type: ItemType.ARMOR,
    level: 5,
    attackMin: 0,
    attackMax: 0,
    defense: 10,
    health: 0,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 20,
  },
];
