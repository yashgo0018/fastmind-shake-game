import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
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
      endTime: {
        gt: new Date(),
      },
    },
    orderBy: {
      startTime: "asc",
    },
    include: { users: { orderBy: { points: "desc" } } },
  });

  if (!game) {
    return NextResponse.json({ error: "No active found" }, { status: 404 });
  }

  const userMembership = await prisma.gameMembership.findFirst({
    where: {
      gameId: game.id,
      username: body.username,
    },
  });

  console.log(userMembership);

  await prisma.$disconnect();

  return NextResponse.json({ game, isUserMember: !!userMembership });
};
