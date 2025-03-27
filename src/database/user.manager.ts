import prisma from "../misc/db";

export async function getUser(discordId: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { id: discordId },
      include: { inventory: true },
    });

    return user;
  } catch (error) {
    console.error("Database error when getting/creating user:", error);
    throw error;
  }
}
