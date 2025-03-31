import { Item, User } from "@prisma/client";

export type QuestInfo = {
  id: string;
  name: string;
  description: string;
  level: number;
  itemReward: QuestReward[];
  itemRewardAmount: number;
  goldMin: number;
  goldMax: number;
  experienceMin: number;
  experienceMax: number;
};

export type QuestReward = {
  id: string;
  state: number[];
  weight: number;
  amount: number;
};

export function getQuestInfo(id: string) {
  const quest = quests.find((quest) => quest.id === id);
  if (!quest) {
    throw new Error(`Quest with ID ${id} not found`);
  }

  return quest;
}

export function assignRandomAvailableQuest(
  user: User,
  questAlreadyActive: number[]
) {
  const minQuestLevel = Math.max(1, user.level - 5);
  const maxQuestLevel = user.level + 5;

  const availableQuests = quests.filter(
    (quest) =>
      quest.level >= minQuestLevel &&
      quest.level <= maxQuestLevel &&
      !questAlreadyActive.includes(parseInt(quest.id))
  );

  if (availableQuests.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableQuests.length);
  return availableQuests[randomIndex];
}

const quests: QuestInfo[] = [
  {
    id: "1",
    name: "The Lost Sword",
    description: "Find the lost sword of the ancient hero.",
    level: 1,
    itemReward: [{ id: "sword_1", state: [0, 0], weight: 10, amount: 1 }],
    experienceMax: 100,
    experienceMin: 50,
    goldMax: 10,
    goldMin: 5,
    itemRewardAmount: 1,
  },
  {
    id: "2",
    name: "The Dragon's Lair",
    description: "Defeat the dragon and claim its treasure.",
    level: 2,
    itemReward: [{ id: "dragon_scale", state: [0, 0], weight: 10, amount: 2 }],
    itemRewardAmount: 1,
    experienceMax: 150,
    experienceMin: 75,
    goldMax: 30,
    goldMin: 5,
  },
];
