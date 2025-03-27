import prisma from "../misc/db";

export async function getOrCreateUser(discordId: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { id: discordId },
      include: { inventory: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { id: discordId },
        include: { inventory: true },
      });
      console.log(`Created new user with ID: ${discordId}`);
    }

    return user;
  } catch (error) {
    console.error("Database error when getting/creating user:", error);
    throw error;
  }
}
