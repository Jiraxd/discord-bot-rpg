import { Item, ItemType, RARITY } from "../item.manager";

export const craftingIngredients: Item[] = [
  {
    itemId: "crafting_1",
    state: [0, 0],
    name: "Iron Ore",
    description: "A piece of iron ore.",
    type: ItemType.CRAFTING,
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
    itemId: "crafting_2",
    state: [0, 0],
    name: "Wood",
    description: "A piece of wood.",
    type: ItemType.CRAFTING,
    level: 1,
    attackMin: 0,
    attackMax: 0,
    defense: 0,
    health: 0,
    mana: 0,
    rarity: RARITY.COMMON,
    npcSellPrice: 2,
  },
];
