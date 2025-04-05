export type Item = {
  itemId: string;
  state: number[]; // used to store item specific states (e.g. durability, enchantment level, added skills, etc.)
  name: string;
  description: string;
  type: ItemType;
  level: number;

  attackMin: number;
  attackMax: number;
  defense: number;
  health: number;
  mana: number;
  rarity: RARITY;
  npcSellPrice: number;
};

export type ItemSkill = {
  id: string;
  name: string;
  description: string;
  type: SKILLTYPE;
  cooldown: number;
  manaCost: number;
  effect: SKILLEFFECT;
};

export enum SKILLTYPE {
  PASSIVE = "Passive",
  ACTIVE = "Active",
}

export enum SKILLEFFECT {
  NONE = "None",
  HEAL = "Heal",
  DAMAGE = "Damage",
  BUFF = "Buff",
  DEBUFF = "Debuff",
  STUN = "Stun",
  SILENCE = "Silence",
  ROOT = "Root",
  SLOW = "Slow",
  BLIND = "Blind",
  FEAR = "Fear",
}

export enum RARITY {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
  EPIC = "Epic",
  LEGENDARY = "Legendary",
  MYTHICAL = "Mythical",
  UNIQUE = "Unique",
  SPECIAL = "Special",
}

export enum ItemType {
  WEAPON = "Weapon",
  ARMOR = "Armor",
  POTION = "Potion",
  FOOD = "Food",
  MISC = "Misc",
  CRAFTING = "Crafting",
  MAP = "Map",
  KEYSTONE = "Keystone",
}
