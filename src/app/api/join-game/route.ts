import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
  gameId: z.number(),
  username: z.string(),
});

export const POST = async (req: NextRequest) => {
  let body: typeof bodySchema._type;

  try {
    const { data, error, success } = bodySchema.safeParse(await req.json());
    if (!success) {
      return NextResponse.json(
        { error: "Invalid body", issues: error.issues },
        { status: 409 }
      );
    }

    body = data;
  } catch (error) {
    return NextResponse.json({ error: "Invalid body" }, { status: 409 });
  }
  console.log(body.username);

  const game = await prisma.games.findFirst({
    where: {
      id: body.gameId,
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  console.log(game);

  if (game.endTime.getTime() < new Date().getTime()) {
    return NextResponse.json({ error: "Game has ended" }, { status: 409 });
  }

  const user = await prisma.user.findUnique({
    where: { username: body.username },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // check if user is already in the game
  const gameUser = await prisma.gameMembership.findFirst({
    where: {
      gameId: body.gameId,
      username: body.username,
    },
  });

  if (gameUser) {
    return NextResponse.json({ success: true }, { status: 208 });
  }

  console.log(body.gameId, body.username, 0);

  await prisma.gameMembership.create({
    data: {
      gameId: body.gameId,
      username: body.username,
      points: 0,
    },
  });

  await prisma.$disconnect();

  return NextResponse.json({ success: true });
};
