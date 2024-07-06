import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params: { gameId } }: { params: { gameId: string } }
) => {
  // check if game exists
  const game = await prisma.games.findUnique({
    where: {
      id: parseInt(gameId),
    },
    include: {
      users: { orderBy: { points: "desc" } },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  await prisma.$disconnect();

  return NextResponse.json({ game });
};
