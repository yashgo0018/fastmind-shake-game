import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
  username: z.string(),
});

export const POST = async (
  req: NextRequest,
  { params: { gameId } }: { params: { gameId: string } }
) => {
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

  const user = await prisma.user.findUnique({
    where: { username: body.username },
    include: {
      games: { include: { game: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.$disconnect();

  return NextResponse.json({ user });
};
